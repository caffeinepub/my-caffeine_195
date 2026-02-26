import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply data migration blueprint as with clause
(with migration = Migration.run)
actor {
  // Prefab AccessControl
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Prefab StorageMixin
  include MixinStorage();

  // ---- State Types ----

  public type UserProfile = {
    name : Text;
  };

  public type District = {
    id : Nat;
    name : Text;
    villages : [Village];
  };

  public type Village = {
    id : Nat;
    name : Text;
    districtId : Nat;
  };

  public type GalleryEvent = {
    id : Nat;
    title : Text;
    subtitle : Text;
    createdAt : Int;
    images : [GalleryImage];
  };

  public type GalleryImage = {
    id : Nat;
    eventId : Nat;
    imageData : Text;
    caption : Text;
    sortOrder : Nat;
  };

  type DistrictInternal = {
    id : Nat;
    name : Text;
  };

  type GalleryEventInternal = {
    id : Nat;
    title : Text;
    subtitle : Text;
    createdAt : Int;
  };

  // ---- Stable State ----

  var nextDistrictId = 1;
  var nextVillageId = 1;
  var nextEventId = 1;
  var nextImageId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let districts = Map.empty<Nat, DistrictInternal>();
  let villages = Map.empty<Nat, Village>();
  let galleryEvents = Map.empty<Nat, GalleryEventInternal>();
  let galleryImages = Map.empty<Nat, GalleryImage>();

  // ---- UserProfile Functions ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
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

  // ---- District & Village Functions ----

  public shared ({ caller }) func addDistrict(name : Text) : async Nat {
    let id = nextDistrictId;
    let district : DistrictInternal = {
      id;
      name;
    };
    districts.add(id, district);
    nextDistrictId += 1;
    id;
  };

  public query func getDistricts() : async [District] {
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

  public shared ({ caller }) func addVillage(districtId : Nat, villageName : Text) : async Nat {
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

  public query func getVillagesByDistrict(districtId : Nat) : async [Village] {
    villages.values().toArray().filter(func(village) { village.districtId == districtId });
  };

  public shared ({ caller }) func deleteDistrict(districtId : Nat) : async Bool {
    let remainingVillages = villages.filter(
      func(_id, village) { village.districtId != districtId }
    );

    let districtExists = districts.containsKey(districtId);
    districts.remove(districtId);

    villages.clear();
    for ((k, v) in remainingVillages.entries()) {
      villages.add(k, v);
    };

    districtExists;
  };

  public shared ({ caller }) func deleteVillage(villageId : Nat) : async Bool {
    let villageExists = villages.containsKey(villageId);
    villages.remove(villageId);
    villageExists;
  };

  // ---- GalleryEvent & GalleryImage Functions (Public) ----

  public shared ({ caller }) func addGalleryEvent(title : Text, subtitle : Text) : async Nat {
    let id = nextEventId;
    let event : GalleryEventInternal = {
      id;
      title;
      subtitle;
      createdAt = Time.now();
    };
    galleryEvents.add(id, event);
    nextEventId += 1;
    id;
  };

  public query func getGalleryEvents() : async [GalleryEvent] {
    let eventsArray = galleryEvents.values().toArray();
    eventsArray.map(
      func(event) {
        let eventImages = galleryImages.values().toArray().filter(
          func(image) { image.eventId == event.id }
        );
        {
          id = event.id;
          title = event.title;
          subtitle = event.subtitle;
          createdAt = event.createdAt;
          images = eventImages;
        };
      }
    );
  };

  public shared ({ caller }) func deleteGalleryEvent(eventId : Nat) : async Bool {
    let remainingImages = galleryImages.filter(
      func(_id, image) { image.eventId != eventId }
    );

    let eventExists = galleryEvents.containsKey(eventId);
    galleryEvents.remove(eventId);

    galleryImages.clear();
    for ((k, v) in remainingImages.entries()) {
      galleryImages.add(k, v);
    };

    eventExists;
  };

  public shared ({ caller }) func addGalleryImage(eventId : Nat, imageData : Text, caption : Text) : async Nat {
    switch (galleryEvents.get(eventId)) {
      case (null) { 0 };
      case (?_) {
        let id = nextImageId;
        let image : GalleryImage = {
          id;
          eventId;
          imageData;
          caption;
          sortOrder = id;
        };
        galleryImages.add(id, image);
        nextImageId += 1;
        id;
      };
    };
  };

  public query func getGalleryImagesByEvent(eventId : Nat) : async [GalleryImage] {
    galleryImages.values().toArray().filter(func(image) { image.eventId == eventId });
  };

  public shared ({ caller }) func deleteGalleryImage(imageId : Nat) : async Bool {
    let imageExists = galleryImages.containsKey(imageId);
    galleryImages.remove(imageId);
    imageExists;
  };
};
