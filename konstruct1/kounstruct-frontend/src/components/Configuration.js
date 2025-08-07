// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import projectImage from "../Images/Project.png";

// import {
//   Allprojects,
//   getProjectsByOwnership,
//   getProjectUserDetails,
// } from "../api";
// import toast from "react-hot-toast";

// // --- Helper for JWT decode ---
// function decodeJWT(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     return null;
//   }
// }

// const Configuration = () => {
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Color template palette
//   const palette =
//     theme === "dark"
//       ? {
//           bg: "bg-[#181820]", // page background
//           card: "bg-[#23232e] text-yellow-100", // card and text color
//           cardShadow: "shadow-lg border border-yellow-400/20",
//           title: "text-yellow-200",
//           overlay: "bg-gray-800 bg-opacity-50",
//           tileShadow: "shadow-md border border-yellow-300/30",
//           badge: "bg-yellow-700 text-yellow-200",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         }
//       : {
//           bg: "bg-gray-50",
//           card: "bg-white text-gray-800",
//           cardShadow: "shadow-lg border border-orange-200",
//           title: "text-[#ea6822]",
//           overlay: "bg-orange-800 bg-opacity-40",
//           tileShadow: "shadow-md border border-orange-100",
//           badge: "bg-orange-400 text-white",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);

//       let userData = null;
//       try {
//         const userDataStr = localStorage.getItem("USER_DATA");
//         if (userDataStr) {
//           userData = JSON.parse(userDataStr);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) userData = decodeJWT(token);
//         }
//       } catch {}

      
//       const rolee =
//         localStorage.getItem("ROLE") ||
//         userData?.role ||
//         userData?.roles?.[0] ||
//         "";

//       const isManager = userData?.is_manager;
//       const isSuperadmin = userData?.is_staff || userData?.superadmin;
//       const isClient = userData?.is_client;

//       try {
//         let response = null;

//         if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
//           response = await Allprojects();
//         } else if (rolee === "Admin") {
//           response = await getProjectUserDetails();
//         } else if (isManager) {
//           if (userData.entity_id) {
//             response = await getProjectsByOwnership({
//               entity_id: userData.entity_id,
//             });
//           } else if (userData.company_id) {
//             response = await getProjectsByOwnership({
//               company_id: userData.company_id,
//             });
//           } else if (userData.org || userData.organization_id) {
//             const orgId = userData.org || userData.organization_id;
//             response = await getProjectsByOwnership({ organization_id: orgId });
//           } else {
//             toast.error(
//               "No entity, company, or organization found for this manager."
//             );
//             setProjects([]);
//             setLoading(false);
//             return;
//           }
//         }

//         if (response && response.status === 200) {
//           setProjects(
//             Array.isArray(response.data) ? response.data : response.data.results || []
            
//           );
//                 console.log(projects,'sdfgtyhujikol');

//         } else if (response) {
//           toast.error(response.data?.message || "Failed to fetch projects.");
//           setProjects([]);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) {
//             const data = decodeJWT(token);
//             if (data && Array.isArray(data.accesses)) {
//               const uniqueProjects = [];
//               const seenIds = new Set();
//               data.accesses.forEach((access) => {
//                 if (access.project_id && !seenIds.has(access.project_id)) {
//                   uniqueProjects.push({
//                     id: access.project_id,
//                     project_name: access.project_name,
//                     roles: access.roles,
//                   });
//                   seenIds.add(access.project_id);
//                 }
//               });
//               setProjects(uniqueProjects);
//                   console.log(projects,'sdfgtyhujikol');
//             } else {
//               setProjects([]);
//             }
//           } else {
//             setProjects([]);
//           }
//         }
//       } catch (error) {
//         toast.error(error?.response?.data?.message || "Error fetching projects.");
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//                    console.log(projects,'sdfgtyhujikol');
//   }, []);

//   const handleProjectClick = (project) => {
//     navigate(`/project/${project.id}`, { state: { project } });
//   };

//   return (
//     <div className={`flex ${palette.bg} min-h-screen`}>
//       <div className="my-5 mx-auto max-w-7xl pt-3 px-5 pb-8 w-full">
//         <div className={`rounded-xl ${palette.cardShadow} ${palette.card}`}>
//           <h2 className={`text-3xl font-bold mb-6 text-center ${palette.title}`}>
//             Projects
//           </h2>
//           {loading ? (
//             <div className="flex justify-center items-center py-14 text-lg">
//               <svg
//                 className="animate-spin h-8 w-8 text-orange-400 dark:text-yellow-200 mr-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Loading projects...
//             </div>
//           ) : projects.length === 0 ? (
//             <div className="text-center py-10 text-xl font-semibold text-red-400">
//               No projects assigned.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {projects.map((project) => (
//                 <div
//                   key={project.id}
//                   className={`relative rounded-xl overflow-hidden cursor-pointer w-56 ${palette.card} ${palette.tileShadow} hover:scale-105 transition-transform duration-150`}
//                   onClick={() => handleProjectClick(project)}
//                 >
//                   <img
//                     src={projectImage}
//                     alt={`Project ${project.name}`}
//                     className="w-full h-80 object-cover"
//                   />
//                   <div
//                     className={`absolute bottom-0 left-0 right-0 ${palette.overlay} text-white text-lg font-semibold p-2`}
//                   >
//                     {project.name || `Project ${project.id}`}
//                   </div>
//                   {/* Role Badges */}
//                   <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
//                     {Array.isArray(project.roles) &&
//                       project.roles.map((role, i) => (
//                         <span
//                           key={i}
//                           className={`px-2 py-1 rounded text-xs font-bold shadow ${palette.badge}`}
//                         >
//                           {typeof role === "string" ? role : role?.role}
//                         </span>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Configuration;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import projectImage from "../Images/Project.png";
// import axios from "axios";

// import {
//   Allprojects,
//   getProjectsByOwnership,
//   getProjectUserDetails,
// } from "../api";
// import toast from "react-hot-toast";

// // --- Helper for JWT decode ---
// function decodeJWT(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     return null;
//   }
// }

// const Configuration = () => {
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nameCache, setNameCache] = useState({});

//   // Color template palette (unchanged)
//   const palette =
//     theme === "dark"
//       ? {
//           bg: "bg-[#181820]",
//           card: "bg-[#23232e] text-yellow-100",
//           cardShadow: "shadow-lg border border-yellow-400/20",
//           title: "text-yellow-200",
//           overlay: "bg-gray-800 bg-opacity-50",
//           tileShadow: "shadow-md border border-yellow-300/30",
//           badge: "bg-yellow-700 text-yellow-200",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         }
//       : {
//           bg: "bg-gray-50",
//           card: "bg-white text-gray-800",
//           cardShadow: "shadow-lg border border-orange-200",
//           title: "text-[#ea6822]",
//           overlay: "bg-orange-800 bg-opacity-40",
//           tileShadow: "shadow-md border border-orange-100",
//           badge: "bg-orange-400 text-white",
//           projectNameBg: "#fffbe7",
//           projectNameColor: "#ea7d19",
//         };

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);

//       let userData = null;
//       try {
//         const userDataStr = localStorage.getItem("USER_DATA");
//         if (userDataStr) {
//           userData = JSON.parse(userDataStr);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) userData = decodeJWT(token);
//         }
//       } catch {}

//       const rolee =
//         localStorage.getItem("ROLE") ||
//         userData?.role ||
//         userData?.roles?.[0] ||
//         "";

//       const isManager = userData?.is_manager;

//       try {
//         let response = null;

//         if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
//           response = await Allprojects();
//         } else if (rolee === "Admin") {
//           response = await getProjectUserDetails();
//         } else if (isManager) {
//           if (userData.entity_id) {
//             response = await getProjectsByOwnership({
//               entity_id: userData.entity_id,
//             });
//           } else if (userData.company_id) {
//             response = await getProjectsByOwnership({
//               company_id: userData.company_id,
//             });
//           } else if (userData.org || userData.organization_id) {
//             const orgId = userData.org || userData.organization_id;
//             response = await getProjectsByOwnership({ organization_id: orgId });
//           } else {
//             toast.error(
//               "No entity, company, or organization found for this manager."
//             );
//             setProjects([]);
//             setLoading(false);
//             return;
//           }
//         }

//         if (response && response.status === 200) {
//           setProjects(
//             Array.isArray(response.data) ? response.data : response.data.results || []
//           );
//         } else if (response) {
//           toast.error(response.data?.message || "Failed to fetch projects.");
//           setProjects([]);
//         } else {
//           const token =
//             localStorage.getItem("ACCESS_TOKEN") ||
//             localStorage.getItem("TOKEN") ||
//             localStorage.getItem("token");
//           if (token) {
//             const data = decodeJWT(token);
//             if (data && Array.isArray(data.accesses)) {
//               const uniqueProjects = [];
//               const seenIds = new Set();
//               data.accesses.forEach((access) => {
//                 if (access.project_id && !seenIds.has(access.project_id)) {
//                   uniqueProjects.push({
//                     id: access.project_id,
//                     name: access.project_name, // Set name directly if available
//                     roles: access.roles,
//                   });
//                   seenIds.add(access.project_id);
//                 }
//               });
//               setProjects(uniqueProjects);
//             } else {
//               setProjects([]);
//             }
//           } else {
//             setProjects([]);
//           }
//         }
//       } catch (error) {
//         toast.error(error?.response?.data?.message || "Error fetching projects.");
//         setProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Fallback: fetch project name by id if missing
//   const getProjectName = (project) => {
//     if (project.name) return project.name;
//     if (nameCache[project.id]) return nameCache[project.id];

//     // If name is not available and not cached, fetch and cache
//     if (!nameCache[project.id]) {
//       axios
//         .get(`https://konstruct.world/projects/projects/${project.id}/`, {
//         headers: {
//            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
//          },
//      })
//         .then((res) => {
//           if (res.data?.name) {
//             setNameCache((prev) => ({
//               ...prev,
//               [project.id]: res.data.name,
//             }));
//           }
//         })
//         .catch(() => {
//           setNameCache((prev) => ({
//             ...prev,
//             [project.id]: "Project " + project.id,
//           }));
//         });
//     }
//     // While loading, fallback to id as label
//     return "Project " + project.id;
//   };
// // if (!nameCache[project.id]) {
// //   axios
// //     .get(
// //       `https://konstruct.world/projects/projects/${project.id}/`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
// //         },
// //       }
// //     )
// //     .then((res) => {
// //       if (res.data?.name) {
// //         setNameCache((prev) => ({
// //           ...prev,
// //           [project.id]: res.data.name,
// //         }));
// //       }
// //     })
// //     .catch(() => {
// //       setNameCache((prev) => ({
// //         ...prev,
// //         [project.id]: "Project " + project.id,
// //       }));
// //     });
// // }

//   const handleProjectClick = (project) => {
//     navigate(`/project/${project.id}`, { state: { project } });
//   };

//   return (
//     <div className={`flex ${palette.bg} min-h-screen`}>
//       <div className="my-5 mx-auto max-w-7xl pt-3 px-5 pb-8 w-full">
//         <div className={`rounded-xl ${palette.cardShadow} ${palette.card}`}>
//           <h2 className={`text-3xl font-bold mb-6 text-center ${palette.title}`}>
//             Projects
//           </h2>
//           {loading ? (
//             <div className="flex justify-center items-center py-14 text-lg">
//               <svg
//                 className="animate-spin h-8 w-8 text-orange-400 dark:text-yellow-200 mr-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Loading projects...
//             </div>
//           ) : projects.length === 0 ? (
//             <div className="text-center py-10 text-xl font-semibold text-red-400">
//               No projects assigned.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {projects.map((project) => (
//                 <div
//                   key={project.id}
//                   className={`relative rounded-xl overflow-hidden cursor-pointer w-56 ${palette.card} ${palette.tileShadow} hover:scale-105 transition-transform duration-150`}
//                   onClick={() => handleProjectClick(project)}
//                 >
//                   <img
//                     src={project.image || projectImage}
//                     alt={getProjectName(project)}
//                     className="w-full h-80 object-cover"
//                     onError={e => { e.target.src = projectImage; }}
//                   />
//                   <div
//                     className={`absolute bottom-0 left-0 right-0 ${palette.overlay} text-white text-lg font-semibold p-2`}
//                   >
//                     {getProjectName(project)}
//                   </div>
//                   {/* Role Badges */}
//                   <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
//                     {Array.isArray(project.roles) &&
//                       project.roles.map((role, i) => (
//                         <span
//                           key={i}
//                           className={`px-2 py-1 rounded text-xs font-bold shadow ${palette.badge}`}
//                         >
//                           {typeof role === "string" ? role : role?.role}
//                         </span>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Configuration;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import projectImage from "../Images/Project.png";
import axios from "axios";

import {
  Allprojects,
  getProjectsByOwnership,
  getProjectUserDetails,
} from "../api";
import toast from "react-hot-toast";

// --- Helper for JWT decode ---
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

const Configuration = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameCache, setNameCache] = useState({});

  // THEME palette
  const ORANGE = "#ffbe63";
  const BG_OFFWHITE = "#fcfaf7";
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#222";
  const iconColor = ORANGE;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      let userData = null;
      try {
        const userDataStr = localStorage.getItem("USER_DATA");
        if (userDataStr) {
          userData = JSON.parse(userDataStr);
        } else {
          const token =
            localStorage.getItem("ACCESS_TOKEN") ||
            localStorage.getItem("TOKEN") ||
            localStorage.getItem("token");
          if (token) userData = decodeJWT(token);
        }
      } catch {}

      const rolee =
        localStorage.getItem("ROLE") ||
        userData?.role ||
        userData?.roles?.[0] ||
        "";

      const isManager = userData?.is_manager;

      try {
        let response = null;

        if (rolee === "Super Admin" || rolee === "SUPERADMIN") {
          response = await Allprojects();
        } else if (rolee === "Admin") {
          response = await getProjectUserDetails();
        } else if (isManager) {
          if (userData.entity_id) {
            response = await getProjectsByOwnership({
              entity_id: userData.entity_id,
            });
          } else if (userData.company_id) {
            response = await getProjectsByOwnership({
              company_id: userData.company_id,
            });
          } else if (userData.org || userData.organization_id) {
            const orgId = userData.org || userData.organization_id;
            response = await getProjectsByOwnership({ organization_id: orgId });
          } else {
            toast.error(
              "No entity, company, or organization found for this manager."
            );
            setProjects([]);
            setLoading(false);
            return;
          }
        }

        if (response && response.status === 200) {
          setProjects(
            Array.isArray(response.data) ? response.data : response.data.results || []
          );
        } else if (response) {
          toast.error(response.data?.message || "Failed to fetch projects.");
          setProjects([]);
        } else {
          const token =
            localStorage.getItem("ACCESS_TOKEN") ||
            localStorage.getItem("TOKEN") ||
            localStorage.getItem("token");
          if (token) {
            const data = decodeJWT(token);
            if (data && Array.isArray(data.accesses)) {
              const uniqueProjects = [];
              const seenIds = new Set();
              data.accesses.forEach((access) => {
                if (access.project_id && !seenIds.has(access.project_id)) {
                  uniqueProjects.push({
                    id: access.project_id,
                    name: access.project_name, // Set name directly if available
                    roles: access.roles,
                  });
                  seenIds.add(access.project_id);
                }
              });
              setProjects(uniqueProjects);
            } else {
              setProjects([]);
            }
          } else {
            setProjects([]);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error fetching projects.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fallback: fetch project name by id if missing
  const getProjectName = (project) => {
    if (project.name) return project.name;
    if (nameCache[project.id]) return nameCache[project.id];

    // If name is not available and not cached, fetch and cache
    if (!nameCache[project.id]) {
      axios
        .get(`https://konstruct.world/projects/projects/${project.id}/`, {
        headers: {
           Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
         },
     })
        .then((res) => {
          if (res.data?.name) {
            setNameCache((prev) => ({
              ...prev,
              [project.id]: res.data.name,
            }));
          }
        })
        .catch(() => {
          setNameCache((prev) => ({
            ...prev,
            [project.id]: "Project " + project.id,
          }));
        });
    }
    // While loading, fallback to id as label
    return "Project " + project.id;
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  return (
    <div 
      className="flex min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="my-8 mx-auto max-w-7xl pt-8 px-6 pb-10 w-full">
        <div 
          className="relative rounded-3xl transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundColor: cardColor,
            border: `2px solid ${borderColor}`,
            boxShadow: theme === "dark" 
              ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(255, 190, 99, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)` 
              : `0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(255, 190, 99, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Decorative Background Elements */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: borderColor }}
          />
          <div 
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
            style={{ backgroundColor: borderColor }}
          />
          
          {/* Header Section */}
          <div className="relative z-10 text-center mb-12 pt-4">
            {/* Decorative Top Line */}
            <div 
              className="w-24 h-1 mx-auto mb-8 rounded-full"
              style={{ backgroundColor: borderColor }}
            />
            
            {/* Title with Enhanced Styling */}
            <h2 
              className="text-5xl font-bold mb-4 tracking-tight relative inline-block"
              style={{ 
                color: textColor,
                textShadow: theme === "dark" 
                  ? `0 2px 8px rgba(255, 190, 99, 0.3)` 
                  : `0 2px 8px rgba(0, 0, 0, 0.1)`,
              }}
            >
              Projects
              
              {/* Animated Underline */}
              {/* <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: borderColor,
                  width: '70%',
                  background: `linear-gradient(90deg, transparent 0%, ${borderColor} 20%, ${borderColor} 80%, transparent 100%)`,
                }}
              /> */}
            </h2>
            
            {/* Subtitle */}
            <p 
              className="text-lg font-medium opacity-80"
              style={{ color: textColor }}
            >
              Manage and explore your project portfolio
            </p>
          </div>

          {/* Content Section */}
          <div className="relative z-10 px-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                {/* Enhanced Loading Spinner */}
                <div className="relative mb-6">
                  <div 
                    className="w-16 h-16 rounded-full border-4 border-opacity-20 animate-spin"
                    style={{ 
                      borderColor: borderColor,
                      borderTopColor: borderColor,
                    }}
                  />
                  <div 
                    className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-transparent animate-pulse"
                    style={{ 
                      borderTopColor: borderColor,
                      animationDuration: '1.5s',
                    }}
                  />
                </div>
                <p 
                  className="text-xl font-semibold animate-pulse"
                  style={{ color: textColor }}
                >
                  Loading projects...
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <div 
                  className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: theme === "dark" ? "#ffffff10" : "#00000005",
                    border: `2px dashed ${borderColor}60`,
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={borderColor} strokeWidth="1.5">
                    <path d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{ color: textColor }}
                >
                  No Projects Available
                </h3>
                <p 
                  className="text-lg opacity-70"
                  style={{ color: textColor }}
                >
                  No projects have been assigned to your account yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-4">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-3 transform-gpu"
                    style={{
                      backgroundColor: cardColor,
                      border: `2px solid ${theme === "dark" ? "#ffffff15" : "#00000010"}`,
                      boxShadow: theme === "dark" 
                        ? `0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(255, 190, 99, 0.1)` 
                        : `0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(255, 190, 99, 0.15)`,
                      animationDelay: `${index * 0.1}s`,
                      width: '100%',
                      maxWidth: '280px',
                      margin: '0 auto',
                    }}
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Role Badges Container */}
                    <div className="absolute top-3 left-3 z-20 flex gap-2 flex-wrap max-w-[calc(100%-24px)]">
                      {Array.isArray(project.roles) &&
                        project.roles.map((role, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-bold shadow-lg transition-all duration-300 group-hover:scale-105"
                            style={{
                              backgroundColor: borderColor,
                              color: theme === "dark" ? "#1a1a1a" : "#ffffff",
                              boxShadow: `0 2px 8px rgba(255, 190, 99, 0.4)`,
                            }}
                          >
                            {typeof role === "string" ? role : role?.role}
                          </span>
                        ))}
                    </div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image || projectImage}
                        alt={getProjectName(project)}
                        className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        onError={e => { e.target.src = projectImage; }}
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}40 50%, ${borderColor}20 100%)`,
                        }}
                      />
                      
                      {/* Hover Icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100"
                        style={{
                          backgroundColor: borderColor,
                          boxShadow: `0 4px 12px rgba(255, 190, 99, 0.4)`,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15,3 21,3 21,9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </div>
                    </div>

                    {/* Project Name Overlay */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500"
                      style={{
                        background: theme === "dark" 
                          ? `linear-gradient(to top, rgba(35, 35, 44, 0.95) 0%, rgba(35, 35, 44, 0.8) 70%, transparent 100%)`
                          : `linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 70%, transparent 100%)`,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <h3 
                        className="text-lg font-bold group-hover:scale-105 transition-transform duration-300"
                        style={{ color: textColor }}
                      >
                        {getProjectName(project)}
                      </h3>
                      
                      {/* Animated Bottom Border */}
                      <div 
                        className="h-1 rounded-full transition-all duration-500 group-hover:w-full mt-2"
                        style={{ 
                          backgroundColor: borderColor,
                          width: '40%',
                        }}
                      />
                    </div>

                    {/* Corner Accent */}
                    <div 
                      className="absolute top-0 left-0 w-0 h-0 border-l-[24px] border-t-[24px] border-r-0 border-b-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderLeftColor: 'transparent',
                        borderTopColor: borderColor,
                      }}
                    />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-pulse transition-opacity duration-700" 
                      style={{ width: '20%', height: '100%' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;