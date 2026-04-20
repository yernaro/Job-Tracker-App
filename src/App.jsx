import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { toCamel, fromCamel } from "./utils/fieldMap";
import { deleteScreenshotFromSupabase, cleanField, getSortedJobs, getFilteredAndSortedJobs } from "./utils/jobHelpers";
import Header from "./components/Header";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import FilterBar from "./components/FilterBar";
import JobDetails from "./components/JobDetails";
import HoverButton from "./components/HoverButton";
import StatsPanel from "./components/StatsPanel";
import AuthForm from "./components/AuthForm";

const App = () => {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedJob, setSelectedJob] = useState(null); 
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [statsOpen, setStatsOpen] = useState(false);

  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoadingUser(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return; 

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching jobs from Supabase:", error.message);
      } else {
        setJobs(data.map(toCamel));  
      }
    };

    fetchJobs();
  }, [user]);

  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  
  const addJob = async (job) => {
    const camelJob = {
      ...job,
      postingLink: cleanField(job.postingLink),
      screenshotUrl: cleanField(job.screenshotUrl),
      description: cleanField(job.description),
      userId: user.id,
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([fromCamel(camelJob)])
      .select();

    if (error) {
      console.error("Error adding job:", error.message);
      return;
    }

    const newJob = toCamel(data[0]);
    setJobs(getSortedJobs([...jobs, newJob], sortOrder));
  };

  
  const deleteJob = async (jobId) => {
    
    const jobToDelete = jobs.find(job => job.id === jobId);

    
    if (jobToDelete?.screenshotUrl) {
      await deleteScreenshotFromSupabase(jobToDelete.screenshotUrl);
    }

    
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error("Error deleting job:", error.message);
      return;
    }

    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  
  const saveEdit = async (updatedJob) => {
    
    const camelJob = {
      ...updatedJob,
      postingLink: cleanField(updatedJob.postingLink),
      screenshotUrl: cleanField(updatedJob.screenshotUrl),
      description: cleanField(updatedJob.description),
    };

    
    const { data, error } = await supabase
      .from('jobs')
      .update(fromCamel(camelJob))
      .eq('id', updatedJob.id)
      .select();

    if (error) {
      console.error("Error updating job:", error.message);
      return;
    }

    
    const updated = toCamel(data[0]);

    
    setJobs(jobs.map(job => job.id === updatedJob.id ? updated : job));

    setSelectedJob(updated);
  };


  const toggleStatsPanel = () => setStatsOpen(!statsOpen);

  if (loadingUser) return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <p className="text-center mt-10">Loading...</p>
    </div>
  );
  if (!user) return <AuthForm setUser={setUser} />;
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <Header />
      <span className="flex space-x-4">
        <HoverButton
          message="🚪 Log Out"
          hoverMessage="🚪 Log Out"
          classes="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded my-4 shadow-lg"
          action={async () => {
            await supabase.auth.signOut();
            setUser(null);
            setJobs([]); 
          }}
        />
        <HoverButton
          message={darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          hoverMessage={darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          classes="bg-gray-300 dark:bg-gray-800 dark:text-white px-4 py-2 rounded my-4 shadow-lg"
          action={() => setDarkMode(!darkMode)}
        />
        <HoverButton
          message="📊 View Stats"
          hoverMessage="📊 View Stats"
          classes="bg-gray-300 dark:bg-gray-800 dark:text-white px-4 py-2 rounded my-4 shadow-lg"
          action={toggleStatsPanel}
        />
      </span>
      <div className="py-1"></div>
      <div className="w-full max-w-md bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {selectedJob ? (
          <JobDetails job={selectedJob} closeJobDetails={closeJobDetails} saveEdit={saveEdit} />
        ) : (
          <>
            <FilterBar filter={filter} setFilter={setFilter} sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <JobForm addJob={addJob} />
            <JobList
              jobs={getFilteredAndSortedJobs(jobs, filter, sortOrder)}
              deleteJob={deleteJob}
              viewJobDetails={viewJobDetails}
            />
          </>
        )}
      </div>
      <StatsPanel jobs={jobs} isOpen={statsOpen} togglePanel={toggleStatsPanel} />
    </div>
  );
};

export default App;
