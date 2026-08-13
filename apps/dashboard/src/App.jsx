import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./context/Themcontext";
import { Provider, useDispatch } from "react-redux";
import { store } from "./app/stores";
import Loader from "./store/utils/Loader";
import Layout from "./components/Layout/Layout";
import DevicesPage from "./components/pages/Devices";
import ProfileEditPage from "./components/pages/ProfileEditPage";
import ProfileSection from "./components/General-Profile/layout/EditprofileLayout/ProfileSection";
import UserLoader from "./services/UserFetcher";
import GeneralLivePreview from "./components/General-Profile/layout/ProfileView";
import ProfileViewSwitcher from "./components/pages/ProfileViewSwitcher";
import Teams from "./components/pages/Teams";
import ContactsPage from "./components/pages/Contacts";
import TemplatesPage from "./components/Teams/Templates";
import AnalyticsPage from "./components/pages/Analytics";
import InviteMembersPage from "./components/Teams/Invite/InviteMembersPage";
import Settings from "./components/pages/Settings";
import { setPathname } from "./app/stores/slices/pagePathSlice";
import Products from "./components/pages/Products";
import SalesAnalytics from "./components/pages/SalesAnalytics";
import TransactionsHistory from "./components/pages/TransactionsHistory";
import OrdersList from "./components/pages/OrdersList";
import PaymentSettings from "./components/pages/PaymentSettings";
import PricingPlan from "./components/pages/PricingPlan";
import StripeConnectReturn from "./components/pages/StripeConnectReturn";
import StripeConnectRefresh from "./components/pages/StripeConnectRefresh";
import PlanProtectedRoute from "./store/utils/PlanProtectedRoute";


// Auth forms are eager-imported so switching between them animates smoothly
// (no Suspense fallback that would momentarily replace the shared shell).
import AuthLayout from "./components/shared/AuthLayout";
import Login from "./components/pages/Login";
import SignupPage from "./components/pages/SignUp";
import Forgetpassword from "./components/pages/ForgetPassword";
import VerifyOpt from "./components/pages/verifyOtp";

// Lazy loading components
const SelectUserType = React.lazy(
  () => import("./components/pages/SelectUser"),
);
const SelectProfileLayout = React.lazy(
  () => import("./components/pages/SelectProfileLayout"),
);
const Profile = React.lazy(() => import("./components/pages/Profile"));
const PageWrapper = React.lazy(() => import("./store/utils/Pagewrapper"));
const PublicRoutes = React.lazy(() => import("./store/utils/PublicRoute"));
const ProtectedRoute = React.lazy(() => import("./store/utils/ProtectedRoute"));
const ActivateProfilePage = React.lazy(
  () => import("./components/pages/ActivateProfilePage"),
);
const Home = React.lazy(() => import("./components/pages/Home"));
const ProfileLayout = React.lazy(
  () => import("./components/pages/ProfileLayout"),
);
const PublicProfileView = React.lazy(
  () => import("./components/PublicProfile/PublicProfileView"),
);
const SosPublicProfile = React.lazy(
  () => import("./components/PublicProfile/SosPublicProfile"),
);
const PetPublicProfile = React.lazy(
  () => import("./components/PublicProfile/PetPublicProfile"),
);
const CodeRouter = React.lazy(
  () => import("./components/PublicProfile/CodeRouter"),
);
const BillingSuccess = React.lazy(() => import("./components/pages/BillingSuccess"));
const BillingCancel = React.lazy(() => import("./components/pages/BillingCancel"));
const PurchaseSuccess = React.lazy(() => import("./components/pages/PurchaseSuccess"));
const PurchaseCancel = React.lazy(() => import("./components/pages/PurchaseCancel"));

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPathname(location.pathname));
  }, [location.pathname]);
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Toaster />
        {/* <UserLoader /> */}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Auth surface — one mounted shell (AuthLayout); the form Outlet
                animates between these routes. */}
            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={
                  <PublicRoutes>
                    <Login />
                  </PublicRoutes>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoutes>
                    <SignupPage />
                  </PublicRoutes>
                }
              />
              <Route path="/forgot-password" element={<Forgetpassword />} />
              <Route path="/verify-otp" element={<VerifyOpt />} />
            </Route>
            <Route
              path="/select-profile"
              element={
                <PageWrapper>
                  <SelectProfileLayout />
                </PageWrapper>
              }
            />
            <Route
              path="/pricing-plan"
              element={

                <PricingPlan />

              }
            />
            <Route
              path="/billing/success"
              element={
                <PageWrapper>
                  <BillingSuccess />
                </PageWrapper>
              }
            />
            <Route
              path="/billing/cancel"
              element={
                <PageWrapper>
                  <BillingCancel />
                </PageWrapper>
              }
            />
            <Route
              path="/purchase/success"
              element={
                <PageWrapper>
                  <PurchaseSuccess />
                </PageWrapper>
              }
            />
            <Route
              path="/purchase/cancel"
              element={
                <PageWrapper>
                  <PurchaseCancel />
                </PageWrapper>
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Layout>
                      <Home />
                    </Layout>
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profiles"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Layout>
                      <ProfileViewSwitcher />
                    </Layout>
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Layout>
                      <Profile /> {/* Edit form + LivePreview */}
                    </Layout>
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-layout"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Layout>
                      <ProfileLayout />
                    </Layout>
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="devices">
                    <PageWrapper>
                      <Layout>
                        <DevicesPage />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="contacts">
                    <PageWrapper>
                      <Layout>
                        <ContactsPage />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  {/* <PlanProtectedRoute requiredFeature="teams"> */}
                    <PageWrapper>
                      <Layout>
                        <Teams />
                      </Layout>
                    </PageWrapper>
                  {/* </PlanProtectedRoute> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams/invite-members"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="teams">
                    <PageWrapper>
                      <Layout>
                        <InviteMembersPage />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams/templates"
              element={
                <ProtectedRoute>
                  {/* <PlanProtectedRoute requiredFeature="teams"> */}
                    <PageWrapper>
                      <Layout>
                        <TemplatesPage />
                      </Layout>
                    </PageWrapper>
                  {/* </PlanProtectedRoute> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/manage-inventory"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="products">
                    <PageWrapper>
                      <Layout>
                        <Products />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/sales-analytics"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="products">
                    <PageWrapper>
                      <Layout>
                        <SalesAnalytics />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/sales-analytics/transactions"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="products">
                    <PageWrapper>
                      <Layout>
                        <TransactionsHistory />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/order-list"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="products">
                    <PageWrapper>
                      <Layout>
                        <OrdersList />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-settings"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="products">
                    <PageWrapper>
                      <Layout>
                        <PaymentSettings />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <PlanProtectedRoute requiredFeature="analytics">
                    <PageWrapper>
                      <Layout>
                        <AnalyticsPage />
                      </Layout>
                    </PageWrapper>
                  </PlanProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Layout>
                      <Settings />
                    </Layout>
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Stripe Connect Redirect URLs */}
            <Route
              path="/dashboard/connect/return"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <StripeConnectReturn />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/connect/refresh"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <StripeConnectRefresh />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/activate/:code"
              element={
                <PageWrapper>
                  <ActivateProfilePage />
                </PageWrapper>
              }
            />

            {/* SOS Public Profile */}
            <Route
              path="/sos/:code"
              element={
                <PageWrapper>
                  <SosPublicProfile />
                </PageWrapper>
              }
            />

            {/* Pet Public Profile */}
            <Route
              path="/pet/:code"
              element={
                <PageWrapper>
                  <PetPublicProfile />
                </PageWrapper>
              }
            />

            {/* Typed Public Profile View (e.g., /s/code, /sc/code) */}
            <Route
              path="/:type/:code"
              element={
                <PageWrapper>
                  <PublicProfileView />
                </PageWrapper>
              }
            />

            {/* Username-based public profile (personal/business/storefront) */}
            <Route
              path="/u/:code"
              element={
                <PageWrapper>
                  <PublicProfileView />
                </PageWrapper>
              }
            />

            {/* Catch-all: resolve device code → redirect to correct profile type */}
            <Route
              path="/:code"
              element={
                <PageWrapper>
                  <CodeRouter />
                </PageWrapper>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
