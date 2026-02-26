import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type UserProfile = {
    name : Text;
  };

  type District = {
    id : Nat;
    name : Text;
    villages : [Village];
  };

  type Village = {
    id : Nat;
    name : Text;
    districtId : Nat;
  };

  type GalleryEvent = {
    id : Nat;
    title : Text;
    subtitle : Text;
    createdAt : Int;
    images : [GalleryImage];
  };

  type GalleryImage = {
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

  type OldActor = {
    nextDistrictId : Nat;
    nextVillageId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    districts : Map.Map<Nat, DistrictInternal>;
    villages : Map.Map<Nat, Village>;
  };

  type NewActor = {
    nextDistrictId : Nat;
    nextVillageId : Nat;
    nextEventId : Nat;
    nextImageId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    districts : Map.Map<Nat, DistrictInternal>;
    villages : Map.Map<Nat, Village>;
    galleryEvents : Map.Map<Nat, GalleryEventInternal>;
    galleryImages : Map.Map<Nat, GalleryImage>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      nextEventId = 1;
      nextImageId = 1;
      galleryEvents = Map.empty<Nat, GalleryEventInternal>();
      galleryImages = Map.empty<Nat, GalleryImage>();
    };
  };
};
