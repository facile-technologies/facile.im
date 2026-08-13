import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function PricingPlan() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const navigate = useNavigate();
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const plans = [
    {
      name: "facile Basic",
      price: "0",
      description: "facile Everyday with basic features",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
    {
      name: "facile Everyday",
      price: "0",
      description: "facile Everyday with basic features",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
    {
      name: "facile Pro",
      price: "0",
      description: "facile Everyday with basic features",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
  ];

  const handleSelect = (planName) => {
    setSelectedPlan(planName);
    localStorage.setItem("selectedPlan", planName); // save plan
  };

  return (
    <div className="min-h-screen bg-[#262626] p-10 text-white rounded-[10px]">
      <div className="text-center mt-6 ">
        <h1 className="text-4xl font-bold">Ready to Build a Team?</h1>
        <p className="text-lg text-[#8E8E8E]  mt-2">
          Collaborate better by upgrading your plan to unlock team management
          features.
        </p>
      </div>

      <div className="flex justify-center mt-7">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="max-w-2xs w-full"
        >
          <TabsList className="flex w-full rounded-full bg-[#3F3F3F]!">
            <TabsTrigger
              value="monthly"
              className="flex-1 rounded-full text-base! data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]!"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="anually"
              className="flex-1 rounded-full text-base! data-[state=active]:bg-black! data-[state=active]:text-white! bg-transparent! text-[#FFFFFF85]! border-none!"
            >
              Annually
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto  mt-7 pb-10">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`dark:bg-[#00000045] rounded-3xl py-10 px-6 cursor-pointer  ${plan.name === selectedPlan && "border border-white "} `}
            onClick={() => handleSelect(plan.name)}
          >
            <div>
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
              <p className="text-5xl font-bold mt-4 text-white">
                ${plan.price}
                <span className="text-xl font-medium text-[#CACACA] ml-1">
                  {" "}
                  per {activeTab === "monthly" ? "month" : "year"}
                </span>
              </p>
              <p className="font-medium text-[#C5C5C5] mt-2">
                {plan.description}
              </p>
              <ul className="space-y-5 text-sm mt-9">
                {plan.features.map((feat, i) => (
                  <li key={i}>
                    <RadioGroup value={`feature-${idx}-${i}`} className="gap-0">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value={`feature-${idx}-${i}`}
                          id={`teams-feature-${idx}-${i}`}
                          className="border-white text-white"
                        />
                        <Label
                          htmlFor={`teams-feature-${idx}-${i}`}
                          className="text-base font-medium text-white"
                        >
                          {feat}
                        </Label>
                      </div>
                    </RadioGroup>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="bg-black! hover:bg-black/80! text-white! font-medium! rounded-2xl text-lg! h-12! w-full! p-4! mt-10!">
              {plan.name === selectedPlan ? (
                <>
                  You are on:{" "}
                  <span className="text-[#B485FF]">{plan.name}</span>
                </>
              ) : (
                "Upgrade"
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
