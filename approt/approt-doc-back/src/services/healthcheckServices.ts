import User from "../models/user";
import { HealthCheckObject } from "../types";

const getVitals = async (): Promise<HealthCheckObject> => {
  const allUsers = await User.find({});
  return {
    herokuConnectionWorking: true, // replace with actual data
    usersAmount: allUsers.length,
    message: "ok",
  };
};

export default { getVitals };
