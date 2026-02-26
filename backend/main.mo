import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Prefab Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Prefab Storage
  include MixinStorage();

  // User Profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // District record
  public type District = {
    id : Nat;
    name : Text;
    villages : [Village];
  };

  // Village record
  public type Village = {
    id : Nat;
    name : Text;
    districtId : Nat;
  };

  var nextDistrictId = 1;
  var nextVillageId = 1;

  let districts = Map.empty<Nat, { id : Nat; name : Text }>();
  let villages = Map.empty<Nat, Village>();

  // ---- User Profile Functions ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---- District and Village Functions ----

  // Add new district (admin only)
  public shared ({ caller }) func addDistrict(name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add districts");
    };
    let id = nextDistrictId;
    let district = {
      id;
      name;
    };
    districts.add(id, district);
    nextDistrictId += 1;
    id;
  };

  // Get all districts with villages (public, no auth required)
  public query ({ caller }) func getDistricts() : async [District] {
    let tempDistricts = districts.values().toArray();
    tempDistricts.map(
      func({ id; name }) {
        let districtVillages = villages.values().toArray().filter(
          func(village) { village.districtId == id }
        );
        {
          id;
          name;
          villages = districtVillages;
        };
      }
    );
  };

  // Add village to district (admin only)
  public shared ({ caller }) func addVillage(districtId : Nat, villageName : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add villages");
    };
    switch (districts.get(districtId)) {
      case (null) { 0 };
      case (?_) {
        let id = nextVillageId;
        let village : Village = {
          id;
          name = villageName;
          districtId;
        };
        villages.add(id, village);
        nextVillageId += 1;
        id;
      };
    };
  };

  // Get all villages for a district (public, no auth required)
  public query ({ caller }) func getVillagesByDistrict(districtId : Nat) : async [Village] {
    villages.values().toArray().filter(func(village) { village.districtId == districtId });
  };

  // Delete district (admin only)
  public shared ({ caller }) func deleteDistrict(districtId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete districts");
    };

    // Remove villages for this district
    let remainingVillages = villages.filter(
      func(_id, village) { village.districtId != districtId }
    );

    let districtExists = districts.containsKey(districtId);
    districts.remove(districtId);

    // Re-add remaining villages to the villages map
    villages.clear();
    for ((k, v) in remainingVillages.entries()) {
      villages.add(k, v);
    };

    districtExists;
  };

  // Delete village (admin only)
  public shared ({ caller }) func deleteVillage(villageId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete villages");
    };
    let villageExists = villages.containsKey(villageId);
    villages.remove(villageId);
    villageExists;
  };
};
