import { useState } from "react";
import { supabase } from "../supabaseClient";
import { deleteScreenshotFromSupabase } from "../utils/jobHelpers";
import { motion } from "framer-motion";
import { TiDelete } from "react-icons/ti";

const JobDetails = ({ job, closeJobDetails, saveEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedJob, setUpdatedJob] = useState({ ...job });
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [removeScreenshot, setRemoveScreenshot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedScreenshotUrl = updatedJob.screenshotUrl;

    
    if (removeScreenshot && updatedScreenshotUrl) {
      await deleteScreenshotFromSupabase(updatedScreenshotUrl);
      updatedScreenshotUrl = null;
    }

    
    if (screenshotFile) {
      
      if (updatedScreenshotUrl) {
        await deleteScreenshotFromSupabase(updatedScreenshotUrl);
      }

      const fileExt = screenshotFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(filePath, screenshotFile);

      if (uploadError) {
        console.error("Error uploading new screenshot:", uploadError.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("screenshots")
          .getPublicUrl(filePath);

        updatedScreenshotUrl = publicUrlData.publicUrl;
      }
    }

    
    saveEdit({ ...updatedJob, screenshotUrl: updatedScreenshotUrl });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
    >
      {/* Header Section */}
      <div className="relative mb-4">
        {/* Company & Role */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white break-words overflow-hidden pr-39">
          {job.company} - {job.role}
        </h2>

        {/* Buttons (Edit & Close) */}
        <div className="absolute top-0 right-0 flex items-center space-x-2">
          <button
            className="bg-gray-400 text-white px-3 rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 min-w-[105px] h-7"
            onClick={() => {
              setUpdatedJob(job);
              setRemoveScreenshot(false);
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>
          <button
            className="text-4xl text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 rounded"
            onClick={closeJobDetails}
          >
            <TiDelete />
          </button>
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <p>Company</p>
          <input
            type="text"
            className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 dark:text-white"
            value={updatedJob.company}
            onChange={(e) => setUpdatedJob({ ...updatedJob, company: e.target.value })}
            required
          />
          <p>Role</p>
          <input
            type="text"
            className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 dark:text-white"
            value={updatedJob.role}
            onChange={(e) => setUpdatedJob({ ...updatedJob, role: e.target.value })}
            required
          />
          <p>Status</p>
          <select
            className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 dark:text-white"
            value={updatedJob.status}
            onChange={(e) => setUpdatedJob({ ...updatedJob, status: e.target.value })}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <p>{`Description (Optional)`}</p>
          <textarea
            className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 dark:text-white"
            value={updatedJob.description || ""}
            onChange={(e) => setUpdatedJob({ ...updatedJob, description: e.target.value })}
            placeholder="Job Description (Optional)"
          ></textarea>
          <p>{`Posting URL (Optional)`}</p>
          <input
            type="url"
            className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 dark:text-white"
            value={updatedJob.postingLink || ""}
            onChange={(e) => setUpdatedJob({ ...updatedJob, postingLink: e.target.value })}
            placeholder="Job Posting URL (Optional)"
          />
          <p>{`Replace Screenshot (Optional)`}</p>
          <input
            type="file"
            accept="image/*"
            className="border p-2 w-full mb-2 bg-white dark:bg-gray-700 dark:text-white"
            onChange={(e) => setScreenshotFile(e.target.files[0])}
          />
          {updatedJob.screenshotUrl && (
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="removeScreenshot"
                checked={removeScreenshot}
                onChange={(e) => setRemoveScreenshot(e.target.checked)}
              />
              <label htmlFor="removeScreenshot" className="text-sm">Remove existing screenshot</label>
            </div>
          )}
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded mt-2">
            Save Changes
          </button>
        </form>
      ) : (
        
        <div>
          <p className={`font-bold mb-4 ${job.status === "Applied"
            ? "text-blue-400"
            : job.status === "Interview"
              ? "text-yellow-600 dark:text-yellow-400"
              : job.status === "Offer"
                ? "text-green-600 dark:text-green-400"
                : "text-red-400"
            }`}>{job.status}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-3 break-words whitespace-pre-wrap">
            {job.description || "No description provided."}
          </p>

          {job.postingLink && (
            <a
              href={job.postingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 underline mb-3 block"
            >
              View Job Posting
            </a>
          )}
          {job.screenshotUrl && (
            <img
              src={job.screenshotUrl}
              alt="Job Posting Screenshot"
              className="rounded-lg shadow-md max-w-full h-auto mb-3"
            />
          )}
        </div>
      )}
    </motion.div>
  );
};

export default JobDetails;
