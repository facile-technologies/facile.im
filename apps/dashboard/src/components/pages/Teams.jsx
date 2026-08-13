import { useEffect, useState } from "react";

import CreateTeam from "../Teams/CreateTeam";
import PricingPlan from "../Teams/Pricing-Plan";
import TeamCreated from "../Teams/TeamCreated";
import { getTeams } from "@/services/teams";
import Loader from "@/store/utils/Loader";

export default function Teams() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await getTeams();
      setTeam(res.data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setTeam(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return team ? <TeamCreated team={team} /> : <CreateTeam setTeam={setTeam} />;
}
