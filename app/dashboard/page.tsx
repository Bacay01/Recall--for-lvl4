import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/assignments");
};

export default DashboardPage;