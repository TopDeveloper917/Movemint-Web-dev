"use client"

import EditProjectDetails from "@/components/dashboard-layout/pages/project-details";
import React, { useEffect, useState } from "react";
import { getProjectById, getSubmittedProposal } from "@/services/api";
import { useUser } from "@/lib/userContext";
import { notification } from 'antd';

const NotificationTypes = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error"
};

const Page = ({ params }) => {
  const { id } = params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useUser();
  const [submittedProposal, setSubmittedProposal] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 2,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const projectData = await getProjectById(id);
        const proposal = await getSubmittedProposal(id, userData.id);
        console.log(projectData);
        setData(projectData);
        setSubmittedProposal(proposal);
        setIsLoading(false);
      } catch (error) {
        openNotificationWithIcon(NotificationTypes.ERROR, "Error", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data == null]);
  return (
    <>
      {contextHolder}
      {!isLoading && <div className="h-full flex flex-col gap-6">
        <p className="text-3xl font-bold">Project Details</p>
        <div className="w-full bg-background rounded-lg">
          <EditProjectDetails data={data} submittedProposal={submittedProposal} />
        </div>
      </div>}
    </>
  );
};

export default Page;
