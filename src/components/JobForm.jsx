import { useState } from "react";
import { supabase } from "../supabaseClient";

const JobForm = ({ addJob }) => {
  const [job, setJob] = useState({
    company: "",
    role: "",
    status: "Applied",
    description: "",
    postingLink: "",
    screenshotUrl: "",
  });
  const [screenshotFile, setScreenshotFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let screenshotUrl = "";
  
    if (screenshotFile) {
      const fileExt = screenshotFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
  
      const { data, error } = await supabase.storage
        .from("screenshots")
        .upload(filePath, screenshotFile);
  
      if (error) {
        console.error("Error uploading screenshot:", error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("screenshots")
          .getPublicUrl(filePath);
  
        screenshotUrl = publicUrlData.publicUrl;
      }
    }
  
    addJob({ ...job, screenshotUrl });
  
    
    setJob({ company: "", role: "", status: "Applied", description: "", postingLink: "", screenshotUrl: "" });
    setScreenshotFile(null);
    
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-gray-100 dark:bg-gray-700">
        <input
          type="text"
          placeholder="Company"
          className="border p-3 w-full mb-3 text-lg bg-white dark:bg-gray-600 dark:text-white"
          value={job.company}
          onChange={(e) => setJob({ ...job, company: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Role"
          className="border p-3 w-full mb-3 text-lg bg-white dark:bg-gray-600 dark:text-white"
          value={job.role}
          onChange={(e) => setJob({ ...job, role: e.target.value })}
          required
        />
        <select
          className="border p-3 w-full mb-3 text-lg bg-white dark:bg-gray-600 dark:text-white"
          value={job.status}
          onChange={(e) => setJob({ ...job, status: e.target.value })}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        {/* Job Description */}
        <textarea
          placeholder="Job Description (Optional)"
          className="border p-3 w-full mb-3 text-lg bg-white dark:bg-gray-600 dark:text-white"
          value={job.description}
          onChange={(e) => setJob({ ...job, description: e.target.value })}
        ></textarea>

        {/* Job Posting Link */}
        <input
          type="url"
          placeholder="Job Posting URL (Optional)"
          className="border p-3 w-full mb-3 text-lg bg-white dark:bg-gray-600 dark:text-white"
          value={job.postingLink}
          onChange={(e) => setJob({ ...job, postingLink: e.target.value })}
        />

        {/* Screenshot Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshotFile(e.target.files[0])}
          className="border p-3 w-full mb-3 bg-white dark:bg-gray-600 dark:text-white"
        />

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded w-full text-lg">
          Add Job
        </button>
      </form>
    </div>
  );
};

export default JobForm;
