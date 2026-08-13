import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlans, createCheckoutSession } from "../../services/user";
import { toast } from "react-hot-toast";

export default function PricingPlan() {
  const [billing, setBilling] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        if (response?.data?.status === "success") {
          setPlans(response.data.data);
          // Automatically pick up the current plan ID if it's placed in response.data or response.data.data
          setCurrentPlanId(response.data.current_plan_id || response.data.data?.current_plan_id || null);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelect = async (plan) => {
    try {
      if (!plan.id) {
        toast.error("Plan ID is missing. Cannot process payment.");
        return;
      }
      
      setProcessingPlan(plan.id);
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      
      const payload = {
        planId: plan.id,
        successUrl: `${baseUrl}/billing/success`,
        cancelUrl: `${baseUrl}/billing/cancel`
      };

      const response = await createCheckoutSession(payload);
      
      if (response?.data?.STATUS === "SUCCESS" && response?.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
         toast.error(response?.data?.MESSAGE || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong creating checkout session.");
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <div className="h-screen flex flex-col relative px-4 md:px-6 overflow-hidden">
      <img
        src="/facile.svg"
        alt="logo"
        className="absolute top-8 left-8 w-20 md:top-6 md:left-6 md:w-[110px] opacity-90"
      />
      <button
        onClick={() => navigate(-1)}
        className="back absolute top-6 right-6 md:top-6 md:right-8 bg-[#ACACAC85] 
             p-2 md:p-2.5 rounded-3xl transition opacity-70 hover:opacity-100 cursor-pointer z-50"
      >
        <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </button>

      <div className="flex-1 flex flex-col py-4 md:py-8 overflow-hidden">
        <div className="text-center mt-12 md:mt-16 mb-4 md:mb-6 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Choose the Plan That Fits You Best
          </h1>
          <p className="text-sm md:text-base lg:text-lg opacity-60 mt-2 hover:text-blue-300 max-w-2xl mx-auto">
            Find the right package for your needs — simple, transparent, and
            built to grow with you.
          </p>
        </div>

        <div className="flex justify-center mb-6 md:mb-8">
          <Tabs
            value={billing}
            onValueChange={(value) => setBilling(value)}
            className="items-center"
          >
            <TabsList className="h-auto rounded-[12px] border border-black/10 bg-[#222222] p-1">
              <TabsTrigger
                value="monthly"
                className="rounded-[8px] px-8 py-2 text-sm font-medium transition-all data-[state=active]:bg-black! data-[state=active]:text-white! data-[state=active]:shadow-md bg-[#363636]! text-white!"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="annually"
                className="rounded-[8px] px-8 py-2 text-sm font-medium transition-all data-[state=active]:bg-black! data-[state=active]:text-white! data-[state=active]:shadow-md bg-[#363636]! text-white!"
              >
                Annually
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plans Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full w-full gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-xl opacity-70 dark:text-white">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-xl opacity-70 dark:text-white">No plans found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto h-full items-stretch">
            {plans
              .filter(plan => {
                const isMonthly = billing === "monthly";
                const isYearly = billing === "annually";

                if (plan.duration) {
                  const duration = plan.duration.toLowerCase();
                  if (isMonthly) return duration === "monthly" || duration === "month";
                  if (isYearly) return duration === "yearly" || duration === "year" || duration === "annual" || duration === "annually";
                }
                return true;
              })
              .map((plan, idx) => {
                const featuresList = Array.isArray(plan.features)
                  ? plan.features
                  : typeof plan.features === "string"
                    ? (() => {
                      try {
                        return JSON.parse(plan.features);
                      } catch (e) {
                        return [plan.features];
                      }
                    })()
                    : [];

                return (
                  <div
                    key={plan.id || idx}
                    className="dark:bg-[#222222] rounded-xl p-6 shadow-lg flex flex-col justify-between"
                  >
                  <div className="flex flex-col gap-3 md:gap-4">
                      <h2 className="text-xl md:text-2xl font-bold dark:text-white">{plan.title}</h2>
                      <div className="flex flex-col">
                        <p className="text-3xl md:text-4xl font-bold dark:text-white">
                          ${plan.price}
                        </p>
                        <span className="text-sm font-normal opacity-70">
                          per {billing === "monthly" ? "month" : "year"}
                        </span>
                      </div>
                      <p className="text-sm md:text-base font-normal opacity-70 line-clamp-2">{plan.description}</p>
                      <ul className="space-y-2 text-sm">
                        {featuresList.map((feat, i) => (
                          <li key={i}>
                            <RadioGroup value={`feature-${idx}-${i}`} className="gap-0">
                              <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value={`feature-${idx}-${i}`}
                                  id={`pricing-feature-${idx}-${i}`}
                                  className="border-black text-black"
                                />
                                <Label
                                  htmlFor={`pricing-feature-${idx}-${i}`}
                                  className="text-sm font-normal text-white"
                                >
                                  {feat}
                                </Label>
                              </div>
                            </RadioGroup>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 md:mt-8">
                      {plan.id === currentPlanId ? (
                        <button
                          disabled
                          className="h-12 md:h-14 text-base w-full bg-gray-200 dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 py-2 rounded-2xl font-bold opacity-80 cursor-not-allowed border border-gray-300 dark:border-white/5 flex justify-center items-center"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelect(plan)}
                          disabled={processingPlan === plan.id}
                          className="getstarted h-12 md:h-14 text-base w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-2xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 font-bold"
                        >
                          {processingPlan === plan.id ? "Processing..." : "Get Started"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
