// associations.js
import User from "./User.model.js";
import TempUser from "./TempUser.model.js";
import Plan from "./Plan.model.js";
import UserPlan from "./UserPlan.model.js";
import Otp from "./Otp.model.js";
import ProfileType from "./ProfileType.model.js";
import UserProfile from "./UserProfile.model.js";
import PersonalProfile from "./PersonalProfile.model.js";
import BusinessProfile from "./BusinessProfile.model.js";
import PetProfile from "./PetProfile.model.js";
import SosProfile from "./SosProfile.model.js";
import StorefrontProfile from "./StorefrontProfile.model.js";
import ProfileCustomization from "./ProfileCustomization.model.js";
import PlatformLink from "./PlatformLink.model.js";
import ProfileLink from "./ProfileLink.model.js";
import ProfileCustomLink from "./ProfileCustomLink.model.js";
import ProfileContact from "./ProfileContact.model.js";
import ProfileContactField from "./ProfileContactField.model.js";
import ProfileContactSubmission from "./ProfileContactSubmission.model.js";
import ProfileSaveContact from "./ProfileSaveContact.model.js";
import PersonalProfileLinkCustomization from "./PersonalProfileLinkCustomization.model.js";
import PersonalCustomLinkCustomization from "./PersonalCustomLinkCustomization.model.js";
import BusinessCustomLinkCustomization from "./BusinessCustomLinkCustomization.model.js";
import BusinessProfileLinkCustomization from "./BusinessProfileLinkCustomization.model.js";
import ProfileMedia from "./ProfileMedia.model.js";
import ProfileMediaCustomization from "./ProfileMediaCustomization.model.js";
import SosAddress from "./SosAddress.model.js";
import SosContactsCustomization from "./SosContactsCustomization.model.js";
import SosDoctorsContact from "./SosDoctorsContact.model.js";
import SosEmergencyContact from "./SosEmergencyContact.model.js";
import SosProfileCustomization from "./SosProfileCustomization.model.js";
import SosMedicalCustomization from "./SosMedicalCustomization.model.js";
import SosMedicalDetail from "./SosMedicalDetail.model.js";
import SosMedicalInsurance from "./SosMedicalInsurance.model.js";
import PetAddress from "./PetAddress.model.js";
import PetContactsCustomization from "./PetContactsCustomization.model.js";
import PetDoctorsContact from "./PetDoctorsContact.model.js";
import PetMedicalInsurance from "./PetMedicalInsurance.model.js";
import PetMedicalDetail from "./PetMedicalDetail.model.js";
import PetMedicalCustomization from "./PetMedicalCustomization.model.js";
import PetEmergencyContact from "./PetEmergencyContact.model.js";
import PetProfileCustomization from "./PetProfileCustomization.model.js";
import PetIdentification from "./PetIdentification.model.js";
import Team from "./Team.model.js";
import TeamMember from "./TeamMember.model.js";
import UserAnalyticsTotal from "./UserAnalyticsTotal.model.js";
import UserAnalyticsCountryDaily from "./UserAnalyticsCountryDaily.model.js";
import RecentActivities from "./RecentActivity.model.js";
import Template from "./Template.model.js";
import UserAnalytics from "./UserAnalytics.model.js";
import UniqueCode from "./UniqueCode.model.js";
import QrCustomization from "./QrCustomization.model.js";
import Product from "./Product.model.js";
import ProductFile from "./ProductFile.model.js";
import ProfileProduct from "./ProfileProduct.model.js";
import ProductCustomization from "./ProductCustomization.model.js";
import ProfileProductSetting from "./ProfileProductSetting.model.js";
import StripeConnectAccount from "./StripeConnectAccount.model.js";
import ProductPurchase from "./ProductPurchase.model.js";
import ProductView from "./ProductView.model.js";
import UserAnalyticsHourly from "./UserAnalyticsHourly.model.js";
import UserAnalyticsCountryTotal from "./UserAnalyticsCountryTotal.model.js";
import UserAnalyticsSource from "./UserAnalyticsSource.model.js";
import CustomLinkAnalytics from "./CustomLinkAnalytics.model.js";
import PlatformLinkAnalytics from "./PlatformLinkAnalytics.model.js";



export function initAssociations() {

  // User <-> Plan

  Plan.hasMany(User, { foreignKey: "plan_id" });
  User.belongsTo(Plan, { foreignKey: "plan_id" });

  // User <-> UserPlan
  User.hasMany(UserPlan, { foreignKey: "user_id", as: "userPlans" });
  UserPlan.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // Plan <-> UserPlan
  Plan.hasMany(UserPlan, { foreignKey: "plan_id", as: "userPlans" });
  UserPlan.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });



  // User <-> Otp

  User.hasMany(Otp, { foreignKey: "user_id" });
  Otp.belongsTo(User, { foreignKey: "user_id" });

  // TempUser is standalone (no FKs to User on purpose)


  // User <-> Profiles (personal, business, pet, sos, storefront)

  User.hasMany(PersonalProfile, { foreignKey: "user_id" });
  PersonalProfile.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(BusinessProfile, { foreignKey: "user_id" });
  BusinessProfile.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(PetProfile, { foreignKey: "user_id" });
  PetProfile.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(SosProfile, { foreignKey: "user_id" });
  SosProfile.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(StorefrontProfile, { foreignKey: "user_id" });
  StorefrontProfile.belongsTo(User, { foreignKey: "user_id" });


  // UserProfile <-> User / ProfileType

  User.hasMany(UserProfile, { foreignKey: "user_id" });
  UserProfile.belongsTo(User, { foreignKey: "user_id" });

  ProfileType.hasMany(UserProfile, { foreignKey: "profile_type_id" });
  UserProfile.belongsTo(ProfileType, { foreignKey: "profile_type_id" });

  // Note: UserProfile.profile_id is polymorphic → no strict FK association.


  // UserProfile <-> ProfileCustomization

  UserProfile.hasOne(ProfileCustomization, { foreignKey: "user_profile_id" });
  ProfileCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile.hasOne(BusinessProfile, { foreignKey: "profile_id" ,as: 'businessProfile',    });
  // BusinessProfile.belongsTo(UserProfile, { foreignKey: "profile_id" });


  // UserProfile belongs to BusinessProfile (one-to-one)
UserProfile.belongsTo(BusinessProfile, {
  foreignKey: 'profile_id',  // field in UserProfile that references BusinessProfile
  as: 'businessProfile',      // alias for the association
  // constraints: false,         // set to true if you have foreign key constraints in DB
  targetKey: 'id'             // field in BusinessProfile being referenced
});

// BusinessProfile has one UserProfile (one-to-one)
BusinessProfile.hasOne(UserProfile, {
  foreignKey: 'profile_id',   // field in UserProfile that references BusinessProfile
  as: 'userProfile',          // alias for the reverse association
  sourceKey: 'id'             // field in BusinessProfile that is referenced
});

  // ProfileContact & fields

  UserProfile.hasMany(ProfileContact, { foreignKey: "user_profile_id" });
  ProfileContact.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  ProfileContact.hasMany(ProfileContactField, {
    foreignKey: "profile_contacts_id",
  });
  ProfileContactField.belongsTo(ProfileContact, {
    foreignKey: "profile_contacts_id",
  });

  // profile_contacts.profile_id is polymorphic (personal/business) → no FK association.


  // PlatformLink <-> ProfileLink

  PlatformLink.hasMany(ProfileLink, { foreignKey: "platform_link_id" });
  ProfileLink.belongsTo(PlatformLink, { foreignKey: "platform_link_id" });

  // User <-> ProfileLink / ProfileCustomLink
  UserProfile.hasMany(ProfileLink, { foreignKey: "user_profile_id" });
  ProfileLink.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  UserProfile.hasMany(ProfileCustomLink, { foreignKey: "user_profile_id" });
  ProfileCustomLink.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  UserProfile.hasOne(PersonalProfileLinkCustomization, { foreignKey: "user_profile_id" });
  PersonalProfileLinkCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  UserProfile.hasOne(PersonalCustomLinkCustomization, { foreignKey: "user_profile_id" });
  PersonalCustomLinkCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  UserProfile.hasOne(BusinessCustomLinkCustomization, { foreignKey: "user_profile_id" });
  BusinessCustomLinkCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  UserProfile.hasOne(BusinessProfileLinkCustomization, { foreignKey: "user_profile_id" });
  BusinessProfileLinkCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  UserProfile.hasMany(ProfileMedia, { foreignKey: "user_profile_id", as: "media", });
  ProfileMedia.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile", });

  // UserProfile <-> ProfileMediaCustomization
  UserProfile.hasOne(ProfileMediaCustomization, { foreignKey: "user_profile_id", as: "mediaCustomization", });
  ProfileMediaCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile", });


  // UserProfile <-> SosProfileCustomization
  UserProfile.hasOne(SosProfileCustomization, { foreignKey: "user_profile_id", as: "sosCustomization", });
  SosProfileCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile", });

  // UserProfile <-> SOS Emergency Contacts
  UserProfile.hasMany(SosEmergencyContact, { foreignKey: "user_profile_id" });
  SosEmergencyContact.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile <-> SOS Doctors Contacts
  UserProfile.hasMany(SosDoctorsContact, { foreignKey: "user_profile_id" });
  SosDoctorsContact.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile <-> SOS Addresses
  UserProfile.hasMany(SosAddress, { foreignKey: "user_profile_id" });
  SosAddress.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile <-> SosContactsCustomization
  UserProfile.hasOne(SosContactsCustomization, { foreignKey: "user_profile_id", as: "sosContactsCustomization", });
  SosContactsCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile", });

  // UserProfile <-> SOS Medical
  UserProfile.hasMany(SosMedicalDetail, { foreignKey: "user_profile_id", as: "medicalDetails" });
  SosMedicalDetail.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile" });

  UserProfile.hasOne(SosMedicalInsurance, { foreignKey: "user_profile_id", as: "medicalInsurances" });
  SosMedicalInsurance.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile" });

  UserProfile.hasOne(SosMedicalCustomization, { foreignKey: "user_profile_id", as: "medicalCustomization" });
  SosMedicalCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile" });


  // UserProfile <-> PetProfileCustomization
  UserProfile.hasOne(PetProfileCustomization, { foreignKey: "user_profile_id", as: "Customization", });
  PetProfileCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile", });

  // UserProfile <-> Pet Emergency Contacts
  UserProfile.hasMany(PetEmergencyContact, { foreignKey: "user_profile_id" });
  PetEmergencyContact.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile <-> Pet Doctors Contacts
  UserProfile.hasMany(PetDoctorsContact, { foreignKey: "user_profile_id" });
  PetDoctorsContact.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile <-> Pet Addresses
  UserProfile.hasMany(PetAddress, { foreignKey: "user_profile_id" });
  PetAddress.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // UserProfile <-> PetContactsCustomization
  UserProfile.hasOne(PetContactsCustomization, { foreignKey: "user_profile_id", as: "ContactsCustomization", });
  PetContactsCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", as: "userProfile", });

  // UserProfile <-> Pet Medical
  UserProfile.hasMany(PetMedicalDetail, { foreignKey: "user_profile_id", });
  PetMedicalDetail.belongsTo(UserProfile, { foreignKey: "user_profile_id", });

  UserProfile.hasOne(PetMedicalInsurance, { foreignKey: "user_profile_id", });
  PetMedicalInsurance.belongsTo(UserProfile, { foreignKey: "user_profile_id", });

  UserProfile.hasOne(PetMedicalCustomization, { foreignKey: "user_profile_id", });
  PetMedicalCustomization.belongsTo(UserProfile, { foreignKey: "user_profile_id", });

  // UserProfile <-> Pet Identification
  UserProfile.hasOne(PetIdentification, { foreignKey: "user_profile_id" });
  PetIdentification.belongsTo(UserProfile, { foreignKey: "user_profile_id" });

  // profile_links.profile_id, profile_custom_links.profile_id
  // polymorphic (personal/business) → no direct FK.


  // ProfileContactSubmission / ProfileSaveContact

  // Both point to profile_id (personal/business) polymorphically, so no FK here.
  // If later you want, you can model them per type with constraints: false.




  // teams assoctions:

  // User <-> Team (One-to-One)

  User.hasOne(Team, {
    foreignKey: "user_id",
    as: "team",
  });

  Team.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });



  // User <-> TeamMember (One-to-One)

  User.hasOne(TeamMember, {
    foreignKey: "user_id",
    as: "teamMember",
  });

  TeamMember.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });



   UserProfile.hasOne(TeamMember, {
    foreignKey: "user_id",
    as: "teamMember",
  });




  TeamMember.belongsTo(UserProfile, {
  foreignKey: 'user_profile_id',
  as: 'userProfile'  // alias for the included model
});



  // Team <-> TeamMember (One-to-Many)

  Team.hasMany(TeamMember, {
    foreignKey: "team_id",
    as: "members",
  });

  TeamMember.belongsTo(Team, {
    foreignKey: "team_id",
    as: "team",
  });







  // UserProfile <-> UserAnalytics (One-to-Many)

  UserProfile.hasMany(UserAnalytics, {
    foreignKey: "user_profile_id",
    as: "dailyAnalytics",
  });

  UserAnalytics.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });




  // UserProfile <-> UserAnalyticsHourly (One-to-Many)

  UserProfile.hasMany(UserAnalyticsHourly, {
    foreignKey: "user_profile_id",
    as: "hourlyAnalytics",
  });

  UserAnalyticsHourly.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });


  // UserProfile <-> UserAnalytics (One-to-Many)

  UserProfile.hasMany(UserAnalyticsSource, {
    foreignKey: "user_profile_id",
    as: "sourceAnalytics",
  });

  UserAnalyticsSource.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });

  // UserProfile <-> UserAnalyticsTotal (One-to-One)

  UserProfile.hasOne(UserAnalyticsTotal, {
    foreignKey: "user_profile_id",
    as: "analyticsTotal",
  });

  UserAnalyticsTotal.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });





  // UserProfile <-> UserAnalyticsCountryDaily (One-to-Many)

  UserProfile.hasMany(UserAnalyticsCountryDaily, {
    foreignKey: "user_profile_id",
    as: "countryDailyAnalytics",
  });

  UserAnalyticsCountryDaily.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });


    // UserProfile <-> UserAnalyticsCountryTotal (One-to-Many)

  UserProfile.hasMany(UserAnalyticsCountryTotal, {
    foreignKey: "user_profile_id",
    as: "countryTotalAnalytics",
  });

  UserAnalyticsCountryTotal.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });





   // UserProfile <-> CustomLinkAnalytics (One-to-Many)

  UserProfile.hasMany(CustomLinkAnalytics, {
    foreignKey: "user_profile_id",
    as: "customLinkAnalytics",
  });

  CustomLinkAnalytics.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });




 // UserProfile <-> PlatformLinkAnalytics (One-to-Many)

  UserProfile.hasMany(PlatformLinkAnalytics, {
    foreignKey: "user_profile_id",
    as: "platformLinkAnalytics",
  });

  PlatformLinkAnalytics.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });




   // ProfileLink <-> PlatformLinkAnalytics (One-to-Many)

  ProfileLink.hasMany(PlatformLinkAnalytics, {
    foreignKey: "profile_link_id",
    as: "platformLinkAnalyticsDetails",
  });

  PlatformLinkAnalytics.belongsTo(ProfileLink, {
    foreignKey: "profile_link_id",
    as: "profileLink",
  });




  // ProfileCustomLink <-> CustomLinkAnalytics (One-to-Many)

  ProfileCustomLink.hasMany(CustomLinkAnalytics, {
    foreignKey: "custom_link_id",
    as: "customLinkAnalyticsDetails",
  });

  CustomLinkAnalytics.belongsTo(ProfileCustomLink, {
    foreignKey: "custom_link_id",
    as: "profileCustomLink",
  });



  // User <-> Template (One-to-Many)

  User.hasMany(Template, {
    foreignKey: "user_id",
    as: "templates",
  });

  Template.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });




  // Team <-> UserProfile (One-to-Many)

  Team.hasMany(UserProfile, {
    foreignKey: "team_id",
    as: "profiles",
  });

  UserProfile.belongsTo(Team, {
    foreignKey: "team_id",
    as: "team",
  });



  // Template <-> UserProfile (One-to-Many)

  Template.hasMany(UserProfile, {
    foreignKey: "template_id",
    as: "profiles",
  });

  UserProfile.belongsTo(Template, {
    foreignKey: "template_id",
    as: "template",
  });



  // User <-> RecentActivities (One-to-Many)

  User.hasMany(RecentActivities, {
    foreignKey: "user_id",
    as: "recentActivities",
  });

  RecentActivities.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });


  // UserProfile <-> RecentActivities (One-to-Many)

  UserProfile.hasMany(RecentActivities, {
    foreignKey: "user_profile_id",
    as: "recentActivities",
  });

  RecentActivities.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });




  User.hasMany(UniqueCode, {
    foreignKey: "user_id",
    as: "uniqueCodes",
  });

  UniqueCode.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // UserProfile <-> UniqueCode (One-to-Many)
  UserProfile.hasMany(UniqueCode, {
    foreignKey: "user_profile_id",
    as: "activatedDevices",
  });

  UniqueCode.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "activatedProfile",
  });

  // UserProfile <-> QrCustomization
  UserProfile.hasOne(QrCustomization, {
    foreignKey: "user_profile_id",
    as: "qrDesign"
  });
  QrCustomization.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile"
  });

  User.hasMany(QrCustomization, { foreignKey: "user_id" });
  QrCustomization.belongsTo(User, { foreignKey: "user_id" });

  // Product Associations
  User.hasMany(Product, { foreignKey: "user_id", as: "products" });
  Product.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Product.hasMany(ProductFile, { foreignKey: "product_id", as: "files" });
  ProductFile.belongsTo(Product, { foreignKey: "product_id", as: "product" });

  UserProfile.belongsToMany(Product, {
    through: ProfileProduct,
    foreignKey: "user_profile_id",
    as: "products",
  });
  Product.belongsToMany(UserProfile, {
    through: ProfileProduct,
    foreignKey: "product_id",
    as: "profiles",
  });

  // Product Customization Association
  UserProfile.hasOne(ProductCustomization, {
    foreignKey: "user_profile_id",
    as: "productCustomization",
  });
  ProductCustomization.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });

  // Profile Product Settings
  ProfileProductSetting.belongsTo(User, { foreignKey: "user_id" });
  ProfileProductSetting.belongsTo(UserProfile, { foreignKey: "user_profile_id" });
  ProfileProductSetting.belongsTo(Product, { foreignKey: "product_id" });

  UserProfile.hasMany(ProfileProductSetting, {
    foreignKey: "user_profile_id",
    as: "productSettings",
  });
  Product.hasMany(ProfileProductSetting, {
    foreignKey: "product_id",
    as: "displaySettings",
  });

  // ─── Stripe Connect ──────────────────────────────────────────────────────────
  User.hasOne(StripeConnectAccount, {
    foreignKey: "user_id",
    as: "connectAccount",
  });
  StripeConnectAccount.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // ─── ProductPurchase ─────────────────────────────────────────────────────────
  Product.hasMany(ProductPurchase, {
    foreignKey: "product_id",
    as: "purchases",
  });
  ProductPurchase.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });

  UserProfile.hasMany(ProductPurchase, {
    foreignKey: "user_profile_id",
    as: "productPurchases",
  });
  ProductPurchase.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });

  User.hasMany(ProductPurchase, {
    foreignKey: "seller_user_id",
    as: "productSales",
  });
  ProductPurchase.belongsTo(User, {
    foreignKey: "seller_user_id",
    as: "seller",
  });

  // ─── ProductView ─────────────────────────────────────────────────────────────
  Product.hasMany(ProductView, {
    foreignKey: "product_id",
    as: "views",
  });
  ProductView.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });

  UserProfile.hasMany(ProductView, {
    foreignKey: "user_profile_id",
    as: "productViews",
  });
  ProductView.belongsTo(UserProfile, {
    foreignKey: "user_profile_id",
    as: "userProfile",
  });

  User.hasMany(ProductView, {
    foreignKey: "seller_user_id",
    as: "productViews",
  });
  ProductView.belongsTo(User, {
    foreignKey: "seller_user_id",
    as: "seller",
  });
}

// (Optional) export all models from here if you like
export {
  User,
  TempUser,
  Plan,
  UserPlan,
  Otp,
  ProfileType,
  UserProfile,
  PersonalProfile,
  BusinessProfile,
  PetProfile,
  SosProfile,
  StorefrontProfile,
  ProfileCustomization,
  SosProfileCustomization,
  PlatformLink,
  ProfileLink,
  ProfileCustomLink,
  ProfileContact,
  ProfileContactField,
  ProfileContactSubmission,
  PersonalCustomLinkCustomization,
  PersonalProfileLinkCustomization,
  BusinessCustomLinkCustomization,
  BusinessProfileLinkCustomization,
  ProfileSaveContact,
  Team,
  TeamMember,
  UserAnalytics,
  UserAnalyticsTotal,
  UserAnalyticsCountryDaily,
  Template,
  RecentActivities,
  UniqueCode,
  QrCustomization,
  ProfileMedia,
  ProfileMediaCustomization,
  Product,
  ProductFile,
  ProfileProduct,
  ProductCustomization,
  ProfileProductSetting,
  StripeConnectAccount,
  ProductPurchase,
  ProductView,
};
