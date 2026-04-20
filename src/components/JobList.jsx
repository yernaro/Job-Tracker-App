import React, { useState } from "react";
import { motion } from "framer-motion";
import { TiDelete } from "react-icons/ti";
import HoverButton from "./HoverButton";

const JobList = ({ jobs, deleteJob, viewJobDetails }) => {

  return (
    <div className="mt-4 space-y-3">
      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <motion.div
            key={job.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow"
          >
            <div className="flex justify-between items-center">
              {/* Basic Job Info */}
              <span
                className="font-medium dark:text-white truncate max-w-[60%] whitespace-nowrap overflow-hidden"
                title={`${job.company} - ${job.role}`}
              >
                {job.company} - {job.role}
              </span>
              <span className="flex gap-2 items-center">
                
                <HoverButton
                  message={job.status}
                  hoverMessage="Details"
                  classes={`w-22 h-7 flex items-center justify-center text-sm font-bold ${job.status === "Applied"
                      ? "bg-blue-500"
                      : job.status === "Interview"
                        ? "bg-yellow-500"
                        : job.status === "Offer"
                          ? "bg-green-500"
                          : "bg-red-500"
                    } text-white hover:bg-gray-400 dark:hover:bg-gray-500`}
                  action={() => viewJobDetails(job)}
                />
                <button
                  className="text-3xl text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 rounded"
                  onClick={() => deleteJob(job.id)}
                >
                  <TiDelete />
                </button>
              </span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default JobList;
