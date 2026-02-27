import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";


actor {
  // Prefab AccessControl
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Prefab StorageMixin
  include MixinStorage();

  // ---- Stable State ----
  var nextDistrictId = 1;
  var nextVillageId = 1;
  var nextMembershipAppId = 1;
  var nextDonationId = 1;
  var nextContactId = 1;
  var nextAssistanceId = 1;
  var adminPasswordHash : Text = "default_admin_2024";

  let districts = Map.empty<Nat, District>();
  let villages = Map.empty<Nat, Village>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let galleryEvents = Map.empty<Nat, OldDistrict>();
  let galleryImages = Map.empty<Nat, OldVillage>();
  let membershipApplications = Map.empty<Nat, MembershipApplication>();
  let donationIntents = Map.empty<Nat, DonationIntent>();
  let contactInquiries = Map.empty<Nat, ContactInquiry>();
  let assistanceRequests = Map.empty<Nat, AssistanceRequest>();

  // ---- State Types ----
  public type UserProfile = {
    name : Text;
  };

  public type District = {
    id : Nat;
    name : Text;
    villageIds : [Nat];
  };

  public type Village = {
    id : Nat;
    name : Text;
    districtId : Nat;
  };

  public type OldDistrict = {
    id : Nat;
    name : Text;
  };

  public type OldVillage = {
    id : Nat;
    name : Text;
    districtId : Nat;
  };

  public type MembershipType = {
    #Monthly;
    #Yearly;
    #Lifetime;
  };

  public type ApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type MembershipApplication = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    membershipType : MembershipType;
    paymentConfirmed : Bool;
    status : ApplicationStatus;
    submittedAt : Int;
  };

  public type DonationIntent = {
    id : Nat;
    name : Text;
    email : Text;
    amount : Text;
    message : Text;
    submittedAt : Int;
  };

  public type ContactInquiry = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    submittedAt : Int;
  };

  public type AssistanceRequest = {
    id : Nat;
    name : Text;
    phone : Text;
    address : Text;
    requestType : Text;
    description : Text;
    submittedAt : Int;
  };

  public type Result<T, E> = {
    #ok : T;
    #err : E;
  };

  // ---- User Profile Methods ----
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
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

  // ---- Admin Password Methods ----
  // Public: anyone can attempt to verify (login mechanism)
  public query func verifyAdminPassword(password : Text) : async Bool {
    adminPasswordHash == password;
  };

  // Admin only: change the admin password
  public shared ({ caller }) func setAdminPassword(oldPassword : Text, newPassword : Text) : async Result<(), Text> {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can change the admin password");
    };
    if (adminPasswordHash != oldPassword) {
      return #err("Old password is incorrect");
    };
    if (newPassword.size() < 6) {
      return #err("New password must be at least 6 characters");
    };
    adminPasswordHash := newPassword;
    #ok(());
  };

  // ---- Membership Application Methods ----
  // Public: anyone can submit a membership application
  public shared func addMembershipApplication(
    name : Text,
    phone : Text,
    email : Text,
    address : Text,
    membershipType : MembershipType,
    paymentConfirmed : Bool,
  ) : async Nat {
    let app : MembershipApplication = {
      id = nextMembershipAppId;
      name;
      phone;
      email;
      address;
      membershipType;
      paymentConfirmed;
      status = #pending;
      submittedAt = Time.now();
    };
    membershipApplications.add(nextMembershipAppId, app);
    nextMembershipAppId += 1;
    app.id;
  };

  // Admin only: list all membership applications, optionally filtered by status
  public query ({ caller }) func listMembershipApplications(statusFilter : ?ApplicationStatus) : async [MembershipApplication] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list membership applications");
    };
    let all = membershipApplications.values().toArray();
    switch (statusFilter) {
      case (null) { all };
      case (?status) {
        all.filter(func(app : MembershipApplication) : Bool {
          switch (app.status, status) {
            case (#pending, #pending) { true };
            case (#approved, #approved) { true };
            case (#rejected, #rejected) { true };
            case (_,_) { false };
          };
        });
      };
    };
  };

  // Admin only: update application status
  public shared ({ caller }) func updateApplicationStatus(id : Nat, newStatus : ApplicationStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update application status");
    };
    switch (membershipApplications.get(id)) {
      case (null) { Runtime.trap("Membership application not found") };
      case (?existing) {
        let updated : MembershipApplication = { existing with status = newStatus };
        membershipApplications.add(id, updated);
      };
    };
  };

  // ---- Donation Intent Methods ----
  // Public: anyone can submit a donation intent
  public shared func addDonationIntent(
    name : Text,
    email : Text,
    amount : Text,
    message : Text,
  ) : async Nat {
    let donation : DonationIntent = {
      id = nextDonationId;
      name;
      email;
      amount;
      message;
      submittedAt = Time.now();
    };
    donationIntents.add(nextDonationId, donation);
    nextDonationId += 1;
    donation.id;
  };

  // Admin only: list all donation intents
  public query ({ caller }) func listDonationIntents() : async [DonationIntent] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list donation intents");
    };
    donationIntents.values().toArray();
  };

  // ---- Contact Inquiry Methods ----
  // Public: anyone can submit a contact inquiry
  public shared func addContactInquiry(
    name : Text,
    email : Text,
    phone : Text,
    message : Text,
  ) : async Nat {
    let inquiry : ContactInquiry = {
      id = nextContactId;
      name;
      email;
      phone;
      message;
      submittedAt = Time.now();
    };
    contactInquiries.add(nextContactId, inquiry);
    nextContactId += 1;
    inquiry.id;
  };

  // Admin only: list all contact inquiries
  public query ({ caller }) func listContactInquiries() : async [ContactInquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list contact inquiries");
    };
    contactInquiries.values().toArray();
  };

  // ---- Assistance Request Methods ----
  // Public: anyone can submit an assistance request
  public shared func addAssistanceRequest(
    name : Text,
    phone : Text,
    address : Text,
    requestType : Text,
    description : Text,
  ) : async Nat {
    let req : AssistanceRequest = {
      id = nextAssistanceId;
      name;
      phone;
      address;
      requestType;
      description;
      submittedAt = Time.now();
    };
    assistanceRequests.add(nextAssistanceId, req);
    nextAssistanceId += 1;
    req.id;
  };

  // Admin only: list all assistance requests
  public query ({ caller }) func listAssistanceRequests() : async [AssistanceRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list assistance requests");
    };
    assistanceRequests.values().toArray();
  };

  // ---- District CRUD Methods ----
  public shared ({ caller }) func addDistrict(name : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add districts");
    };

    let district : District = {
      id = nextDistrictId;
      name;
      villageIds = [];
    };

    districts.add(nextDistrictId, district);
    nextDistrictId += 1;
    district.id;
  };

  public shared ({ caller }) func editDistrict(id : Nat, newName : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can edit districts");
    };

    switch (districts.get(id)) {
      case (null) { Runtime.trap("District not found") };
      case (?existing) {
        let updatedDistrict : District = { existing with name = newName };
        districts.add(id, updatedDistrict);
      };
    };
  };

  public shared ({ caller }) func deleteDistrict(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete districts");
    };

    switch (districts.get(id)) {
      case (null) { Runtime.trap("District not found") };
      case (?_) {
        villages.filter(
          func(_id, village) { village.districtId == id }
        ).forEach(
          func(villageId, _) { villages.remove(villageId) }
        );
        districts.remove(id);
      };
    };
  };

  public query func getDistricts() : async [District] {
    districts.values().toArray();
  };

  // ---- Village CRUD Methods ----
  public shared ({ caller }) func addVillage(districtId : Nat, name : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add villages");
    };

    switch (districts.get(districtId)) {
      case (null) { Runtime.trap("District not found") };
      case (?_) {
        let village : Village = {
          id = nextVillageId;
          name;
          districtId;
        };

        villages.add(nextVillageId, village);

        let updatedVillageIds = [village.id];
        switch (districts.get(districtId)) {
          case (null) {};
          case (?existingDistrict) {
            let combinedVillageIds = existingDistrict.villageIds.concat(updatedVillageIds);
            let updatedDistrict : District = { existingDistrict with villageIds = combinedVillageIds };
            districts.add(districtId, updatedDistrict);
          };
        };

        nextVillageId += 1;
        village.id;
      };
    };
  };

  public shared ({ caller }) func editVillage(id : Nat, newName : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can edit villages");
    };

    switch (villages.get(id)) {
      case (null) { Runtime.trap("Village not found") };
      case (?existing) {
        let updatedVillage : Village = { existing with name = newName };
        villages.add(id, updatedVillage);
      };
    };
  };

  public shared ({ caller }) func deleteVillage(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete villages");
    };

    switch (villages.get(id)) {
      case (null) { Runtime.trap("Village not found") };
      case (?village) {
        switch (districts.get(village.districtId)) {
          case (null) {};
          case (?district) {
            let updatedVillageIds = district.villageIds.filter(
              func(villageId) { villageId != id }
            );
            let updatedDistrict : District = { district with villageIds = updatedVillageIds };
            districts.add(village.districtId, updatedDistrict);
          };
        };
        villages.remove(id);
      };
    };
  };

  public query func getVillagesByDistrict(districtId : Nat) : async [Village] {
    villages.values().toArray().filter(func(village) { village.districtId == districtId });
  };
};

