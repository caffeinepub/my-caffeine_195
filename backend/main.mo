import Map "mo:core/Map";
import List "mo:core/List";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type Donation = {
    donorName : Text;
    amount : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  module Donation {
    func compare(donation1 : Donation, donation2 : Donation) : Order.Order {
      switch (Int.compare(donation2.timestamp, donation1.timestamp)) {
        case (#equal) { donation1.message.compare(donation2.message) };
        case (order) { order };
      };
    };
  };

  type Activity = {
    id : Nat;
    title : Text;
    description : Text;
    date : Time.Time;
    image : Storage.ExternalBlob;
  };

  type ContactInquiry = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let donations = List.empty<Donation>();
  let activities = Map.empty<Nat, Activity>();
  let inquiries = List.empty<ContactInquiry>();

  // Seed example activities
  public shared ({ caller }) func seedActivities() : async () {
    if (activities.size() > 0) { return };
    let exampleActivities : [Activity] = [
      {
        id = 1;
        title = "Food Drive";
        description = "Providing food to the needy";
        date = Time.now();
        image = "image1.jpg"; // Placeholder
      },
      {
        id = 2;
        title = "Education Program";
        description = "Supporting children's education";
        date = Time.now();
        image = "image2.jpg"; // Placeholder
      },
      {
        id = 3;
        title = "Medical Camp";
        description = "Free medical checkups";
        date = Time.now();
        image = "image3.jpg"; // Placeholder
      },
    ];

    let activityValues = exampleActivities.values();
    for (activity in activityValues) {
      activities.add(activity.id, activity);
    };
  };

  public shared ({ caller }) func addDonation(donorName : Text, amount : Nat, message : Text) : async () {
    let timestamp = Time.now();
    let donation : Donation = {
      donorName;
      amount;
      message;
      timestamp;
    };
    donations.add(donation);
  };

  public query ({ caller }) func getDonations() : async [Donation] {
    donations.toArray();
  };

  public shared ({ caller }) func addContactInquiry(name : Text, email : Text, message : Text) : async () {
    let timestamp = Time.now();
    let inquiry : ContactInquiry = {
      name;
      email;
      message;
      timestamp;
    };
    inquiries.add(inquiry);
  };

  public query ({ caller }) func getActivities() : async [Activity] {
    activities.values().toArray();
  };

  public query ({ caller }) func getFoundationInfo() : async {
    address : Text;
    phone : Text;
    email : Text;
    socialMedia : [Text];
    description : Text;
  } {
    {
      address = "123 Main Street, City, India";
      phone = "+91 1234567890";
      email = "info@foundation.org";
      socialMedia = ["@foundation_insta", "@foundation_fb"];
      description = "हमारा मिशन जरूरतमंदों की मदद करना है।";
    };
  };
};
