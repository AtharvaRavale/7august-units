// import React, { useEffect, useRef, useState } from "react";
// import profile from "../../src/Images/profile.jpg";
// import { IoMdArrowDropdown } from "react-icons/io";
// import {
//   FiMail,
//   FiPhone,
//   FiCalendar,
//   FiClock,
//   FiUser,
//   FiSettings,
//   FiLogOut,
//   FiBriefcase,
//   FiShield,
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";
// import { organnizationInstance } from "../api/axiosInstance";

// const ORANGE = "#ffbe63";
// const BG_OFFWHITE = "#fcfaf7";

// function Profile({ onClose }) {
//   const [manage, setManage] = useState(false);
//   const dropdownRef = useRef(null);
//   const profileRef = useRef(null);
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const [hydrated, setHydrated] = useState(false);

//   const [userData, setUserData] = useState(null);
//   const [accesses, setAccesses] = useState([]);

//   // Org/company/entity details
//   const [organizationDetails, setOrganizationDetails] = useState({
//     organization: null,
//     company: null,
//     entity: null,
//     loading: true,
//     error: null,
//   });

//   // Palette
//   const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
//   const cardColor = theme === "dark" ? "#23232c" : "#fff";
//   const borderColor = ORANGE;
//   const textColor = theme === "dark" ? "#fff" : "#9c670d";
//   const iconColor = ORANGE;
//   const accentBg = ORANGE;

//   // Fetch org/company/entity details
//   const fetchOrganizationDetails = async (userData) => {
//     if (!userData) return;
//     try {
//       setOrganizationDetails((prev) => ({
//         ...prev,
//         loading: true,
//         error: null,
//       }));
//       const results = {};
//       if (userData.org) {
//         try {
//           const orgResponse = await organnizationInstance.get(
//             `organizations/${userData.org}/`
//           );
//           results.organization = orgResponse.data;
//         } catch {}
//       }
//       if (userData.company_id || userData.company) {
//         const companyId = userData.company_id || userData.company;
//         try {
//           const companyResponse = await organnizationInstance.get(
//             `companies/${companyId}/`
//           );
//           results.company = companyResponse.data;
//         } catch {}
//       }
//       if (userData.entity_id || userData.entity) {
//         const entityId = userData.entity_id || userData.entity;
//         try {
//           const entityResponse = await organnizationInstance.get(
//             `entities/${entityId}/`
//           );
//           results.entity = entityResponse.data;
//         } catch {}
//       }
//       setOrganizationDetails({
//         ...results,
//         loading: false,
//         error: null,
//       });
//     } catch (error) {
//       setOrganizationDetails((prev) => ({
//         ...prev,
//         loading: false,
//         error: "Failed to load organization details",
//       }));
//     }
//   };

//   useEffect(() => {
//     const userString = localStorage.getItem("USER_DATA");
//     if (userString && userString !== "undefined") {
//       const parsedUserData = JSON.parse(userString);
//       setUserData(parsedUserData);
//       fetchOrganizationDetails(parsedUserData);
//     }
//     const accessString = localStorage.getItem("ACCESSES");
//     if (accessString && accessString !== "undefined") {
//       try {
//         setAccesses(JSON.parse(accessString));
//       } catch {
//         setAccesses([]);
//       }
//     }
//     setHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (hydrated && !userData) {
//       navigate("/login", { replace: true });
//     }
//   }, [hydrated, userData, navigate]);

//   // Extract unique roles
//   let allRoles = [];
//   if (Array.isArray(accesses)) {
//     accesses.forEach((access) => {
//       if (access.roles && Array.isArray(access.roles)) {
//         access.roles.forEach((role) => {
//           const roleStr = typeof role === "string" ? role : role?.role;
//           if (roleStr && !allRoles.includes(roleStr)) {
//             allRoles.push(roleStr);
//           }
//         });
//       }
//     });
//   }

//   let role = "User";
//   if (userData?.superadmin || userData?.is_staff) {
//     role = "Super Admin";
//   } else if (userData?.is_client) {
//     role = "Admin";
//   } else if (userData?.is_manager) {
//     role = "Manager";
//   } else if (allRoles.length > 0) {
//     const uniqueRoles = [...new Set(allRoles)];
//     role = uniqueRoles.join(", ");
//   }

//   useEffect(() => {
//     localStorage.setItem("ROLE", role);
//   }, [role]);

//   // Close profile when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         onClose();
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setManage(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);

//   // Sign out logic
//   const handleSignOut = () => {
//     localStorage.removeItem("ACCESS_TOKEN");
//     localStorage.removeItem("REFRESH_TOKEN");
//     localStorage.removeItem("USER_DATA");
//     localStorage.removeItem("ACCESSES");
//     localStorage.removeItem("ROLE");
//     navigate("/login");
//     if (typeof onClose === "function") onClose();
//   };

//   // Helper functions
//   const isValidString = (value) => value && String(value).trim() !== "";
//   const hasContactData = () =>
//     isValidString(userData?.email) ||
//     isValidString(userData?.phone_number) ||
//     isValidString(userData?.date_joined) ||
//     isValidString(userData?.last_login);

//   const hasOrganizationData = () =>
//     organizationDetails.organization ||
//     organizationDetails.company ||
//     organizationDetails.entity ||
//     isValidString(userData?.org);

//   // ---- VALUE COLOR: STRONG ORANGE (for ALL field values) ----
//   const valueColor = "#bb5600"; // Strong readable orange

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-start justify-end"
//       style={{
//         background: "rgba(20,16,10,0.33)",
//         backdropFilter: "blur(2px)",
//       }}
//     >
//       <div
//         ref={profileRef}
//         className="w-full max-w-md mx-auto rounded-3xl overflow-hidden max-h-[88vh] flex flex-col relative"
//         style={{
//           background: cardColor,
//           border: `2px solid ${borderColor}`,
//           color: textColor,
//           boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
//           marginTop: "32px",
//           marginRight: "32px",
//         }}
//       >
//         {/* Orange gradient bar */}
//         <div
//           style={{
//             width: "100%",
//             height: 5,
//             background: "linear-gradient(90deg, #ffbe63 30%, #ffd080 100%)",
//             borderTopLeftRadius: 18,
//             borderTopRightRadius: 18,
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: 20,
//           }}
//         ></div>

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: 14,
//             right: 18,
//             background: "#fff8f0",
//             border: `1.5px solid ${borderColor}`,
//             borderRadius: "50%",
//             width: 32,
//             height: 32,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: iconColor,
//             zIndex: 40,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//           }}
//           title="Close"
//         >
//           <span style={{ fontWeight: 700, fontSize: 21 }}>×</span>
//         </button>

//         {/* Header */}
//         <div
//           style={{
//             background: bgColor,
//             borderBottom: `1.5px solid ${borderColor}`,
//             padding: "32px 0 18px 0",
//           }}
//           className="flex flex-col items-center"
//         >
//           <img
//             src={profile}
//             alt="profile"
//             style={{
//               height: 76,
//               width: 76,
//               borderRadius: "50%",
//               objectFit: "cover",
//               border: `3px solid ${ORANGE}`,
//               marginBottom: 8,
//               boxShadow: "0 0 0 3px #fff",
//             }}
//           />
//           <h2
//             style={{
//               fontWeight: 700,
//               fontSize: 22,
//               marginBottom: 4,
//               color: textColor,
//             }}
//           >
//             {userData?.username}
//           </h2>
//           <div style={{ color: "#a37d31", fontSize: 15, marginBottom: 2 }}>
//             ID: {userData?.user_id}
//           </div>
//           <div
//             style={{
//               background: accentBg,
//               color: "#ad5700",
//               borderRadius: 14,
//               fontWeight: 600,
//               fontSize: 14,
//               padding: "4px 16px",
//               margin: "7px 0",
//               boxShadow: "0 1px 4px rgba(255,190,99,0.08)",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 7,
//             }}
//           >
//             <FiShield size={15} style={{ color: "#ad5700" }} /> {role}
//           </div>
//         </div>

//         {/* Scrollable content area */}
//         <div
//           className="flex-1 overflow-y-auto px-6 py-5"
//           style={{
//             background: theme === "dark" ? "#23232c" : "#fff",
//             minHeight: 160,
//           }}
//         >
//           {/* Project Roles Section */}
//           {accesses?.length > 0 && (
//             <div
//               className="rounded-2xl p-5 mb-5"
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <div
//                 className="flex items-center gap-2 mb-4"
//                 style={{ color: ORANGE }}
//               >
//                 <FiBriefcase size={18} />
//                 <h3
//                   className="font-semibold text-base"
//                   style={{ color: "#9c670d" }}
//                 >
//                   Project Access
//                 </h3>
//               </div>
//               <div className="space-y-3">
//                 {accesses.slice(0, 3).map(
//                   (access, idx) =>
//                     isValidString(access.project_id) && (
//                       <div
//                         key={idx}
//                         className="rounded-xl p-4"
//                         style={{
//                           background: "#fff",
//                           border: `1px solid ${borderColor}`,
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <span
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {access.project_name ||
//                               `Project ${access.project_id}`}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span
//                             className="text-sm font-medium"
//                             style={{ color: "#a37d31" }}
//                           >
//                             ID: {access.project_id}
//                           </span>
//                           <div className="flex flex-wrap gap-2">
//                             {access.roles?.slice(0, 2).map((role, j) => {
//                               const roleStr =
//                                 typeof role === "string" ? role : role?.role;
//                               return isValidString(roleStr) ? (
//                                 <span
//                                   key={j}
//                                   className="px-3 py-1"
//                                   style={{
//                                     background: ORANGE,
//                                     color: "#ad5700",
//                                     borderRadius: 12,
//                                     fontWeight: 600,
//                                     fontSize: 12,
//                                   }}
//                                 >
//                                   {roleStr}
//                                 </span>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                 )}
//                 {accesses.length > 3 && (
//                   <div
//                     className="text-center text-sm pt-2"
//                     style={{ color: "#a86c10" }}
//                   >
//                     +{accesses.length - 3} more projects
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Contact Information */}
//           {hasContactData() && (
//             <div
//               className="rounded-2xl p-5 mb-5"
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <h3
//                 className="font-semibold mb-4 flex items-center gap-2 text-base"
//                 style={{ color: "#9c670d" }}
//               >
//                 <FiMail size={18} />
//                 Contact Details
//               </h3>
//               <div className="space-y-3">
//                 {isValidString(userData?.email) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiMail size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Email
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.email}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.phone_number) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiPhone size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Phone
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.phone_number}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.date_joined) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiCalendar size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Joined
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.date_joined}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.last_login) && (
//                   <div
//                     className="flex items-center gap-4 p-4 rounded-xl"
//                     style={{
//                       background: "#fff",
//                       border: `1px solid ${borderColor}`,
//                       boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <FiClock size={16} style={{ color: iconColor }} />
//                     <div>
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "#bfa672" }}
//                       >
//                         Last Login
//                       </p>
//                       <p
//                         className="font-semibold text-base"
//                         style={{ color: valueColor }}
//                       >
//                         {userData.last_login}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Organization Section */}
//           {hasOrganizationData() && (
//             <div
//               className="rounded-2xl p-5 mb-4 relative"
//               ref={dropdownRef}
//               style={{
//                 background: "#fff6ea",
//                 border: `1.2px solid ${borderColor}`,
//               }}
//             >
//               <h3
//                 className="font-semibold mb-4 flex items-center gap-2 text-base"
//                 style={{ color: "#9c670d" }}
//               >
//                 <FiBriefcase size={18} />
//                 Organization Details
//               </h3>
//               {organizationDetails.loading ? (
//                 <div
//                   className="flex items-center justify-center p-6 rounded-xl"
//                   style={{
//                     background: "#fff0e1",
//                     border: `1px solid ${borderColor}`,
//                   }}
//                 >
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
//                   <span
//                     className="ml-3 text-sm font-medium"
//                     style={{ color: "#ab7a13" }}
//                   >
//                     Loading organization details...
//                   </span>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {/* Organization */}
//                   {organizationDetails.organization && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.organization.organization_name
//                             ? organizationDetails.organization
//                                 .organization_name[0]
//                             : "O"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Organization
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.organization
//                               .organization_name || `Org ${userData.org}`}
//                           </p>
//                           {organizationDetails.organization.contact_email && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {organizationDetails.organization.contact_email}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Company */}
//                   {organizationDetails.company && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.company.name
//                             ? organizationDetails.company.name[0]
//                             : "C"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Company
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.company.name}
//                           </p>
//                           {(organizationDetails.company.region ||
//                             organizationDetails.company.country) && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {[
//                                 organizationDetails.company.region,
//                                 organizationDetails.company.country,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Entity */}
//                   {organizationDetails.entity && (
//                     <div
//                       className="p-4 rounded-xl"
//                       style={{
//                         background: "#fff",
//                         border: `1px solid ${borderColor}`,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                       }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                           style={{ background: accentBg, color: "#ad5700" }}
//                         >
//                           {organizationDetails.entity.name
//                             ? organizationDetails.entity.name[0]
//                             : "E"}
//                         </div>
//                         <div>
//                           <p
//                             className="text-sm font-medium"
//                             style={{ color: "#bfa672" }}
//                           >
//                             Entity
//                           </p>
//                           <p
//                             className="font-semibold text-base"
//                             style={{ color: valueColor }}
//                           >
//                             {organizationDetails.entity.name}
//                           </p>
//                           {(organizationDetails.entity.state ||
//                             organizationDetails.entity.region ||
//                             organizationDetails.entity.zone) && (
//                             <p
//                               className="text-sm"
//                               style={{ color: valueColor }}
//                             >
//                               {[
//                                 organizationDetails.entity.state,
//                                 organizationDetails.entity.region,
//                                 organizationDetails.entity.zone,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {/* Fallback: org ID only */}
//                   {!organizationDetails.organization &&
//                     !organizationDetails.company &&
//                     !organizationDetails.entity &&
//                     isValidString(userData?.org) && (
//                       <button
//                         onClick={() => setManage(!manage)}
//                         className="w-full flex items-center justify-between p-4 rounded-xl"
//                         style={{
//                           background: "#fff",
//                           border: `1px solid ${borderColor}`,
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div
//                             className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
//                             style={{ background: accentBg, color: "#ad5700" }}
//                           >
//                             {isValidString(userData?.organization_name)
//                               ? String(userData.organization_name)[0]
//                               : String(userData.org)[0]}
//                           </div>
//                           <div className="text-left">
//                             <p
//                               className="font-semibold text-base"
//                               style={{ color: valueColor }}
//                             >
//                               {userData.organization_name ||
//                                 `Organization ${userData.org}`}
//                             </p>
//                             <p className="text-sm" style={{ color: "#bfa672" }}>
//                               Org ID: {userData.org}
//                             </p>
//                           </div>
//                         </div>
//                         <IoMdArrowDropdown
//                           size={20}
//                           style={{
//                             color: iconColor,
//                             transform: manage ? "rotate(180deg)" : undefined,
//                             transition: "transform 0.2s",
//                           }}
//                         />
//                       </button>
//                     )}
//                   {/* Manage Dropdown */}
//                   {manage && (
//                     <div
//                       className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50"
//                       style={{
//                         background: cardColor,
//                         border: `1.5px solid ${borderColor}`,
//                         boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
//                         animation: "slide-in-from-top .23s",
//                       }}
//                     >
//                       <button
//                         className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
//                         style={{
//                           background: ORANGE,
//                           color: "#ad5700",
//                         }}
//                         onClick={() =>
//                           alert("Organization management coming soon!")
//                         }
//                       >
//                         <FiSettings size={16} />
//                         Manage Organization
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {organizationDetails.error && (
//                 <div
//                   className="p-4 rounded-xl"
//                   style={{ background: "#ffeded", border: `1px solid #e96232` }}
//                 >
//                   <p className="text-red-400 text-sm font-medium">
//                     {organizationDetails.error}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Action buttons */}
//         <div
//           style={{
//             background: cardColor,
//             borderTop: `1.5px solid ${borderColor}`,
//             padding: 20,
//             borderBottomLeftRadius: 24,
//             borderBottomRightRadius: 24,
//           }}
//           className="flex gap-4"
//         >
//           <button
//             className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//             style={{
//               background: ORANGE,
//               color: "#8a4c00",
//               boxShadow: "0 2px 8px rgba(255, 190, 99, 0.15)",
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//             onClick={() => alert("Account details feature coming soon!")}
//           >
//             <FiUser size={16} style={{ color: "#ad5700" }} /> My Account
//           </button>
//           <button
//             className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
//             style={{
//               background: "#fff0e1",
//               color: "#e24717",
//               border: `1.5px solid #e24717`,
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//             onClick={handleSignOut}
//           >
//             <FiLogOut size={16} style={{ color: "#e24717" }} /> Sign Out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;


import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { organnizationInstance } from "../api/axiosInstance";
import axios from "axios";

const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";

// ---- Helper: Get Initials ----
function getInitials(user) {
  if (!user) return "";
  if (user.first_name || user.last_name) {
    return (
      (user.first_name?.charAt(0) || "") +
      (user.last_name?.charAt(0) || "")
    ).toUpperCase();
  }
  if (user.username) {
    // Try to split by space, dot, underscore, or hyphen
    const parts = user.username.split(/[\s._-]+/);
    return (
      (parts[0]?.charAt(0) || "") + (parts[1]?.charAt(0) || "")
    ).toUpperCase();
  }
  return "";
}

function Profile({ onClose }) {
  const [manage, setManage] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const [nameCache, setNameCache] = useState({});

  const [userData, setUserData] = useState(null);
  const [accesses, setAccesses] = useState([]);

  // Org/company/entity details
  const [organizationDetails, setOrganizationDetails] = useState({
    organization: null,
    company: null,
    entity: null,
    loading: true,
    error: null,
  });

  // ---- PROJECT NAME GETTER ----
  const getProjectName = (access) => {
    if (access.project_name) return access.project_name;
    if (nameCache[access.project_id]) return nameCache[access.project_id];

    // If not available and not cached, fetch and cache by project_id
    if (access.project_id && !nameCache[access.project_id]) {
      axios
        .get(`https://konstruct.world/projects/projects/${access.project_id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`,
          },
        })
        .then((res) => {
          if (res.data?.name) {
            setNameCache((prev) => ({
              ...prev,
              [access.project_id]: res.data.name,
            }));
          }
        })
        .catch(() => {
          setNameCache((prev) => ({
            ...prev,
            [access.project_id]: "Project " + access.project_id,
          }));
        });
    }
    // While loading, fallback to id as label
    return "Project " + access.project_id;
  };

  // Palette
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#9c670d";
  const iconColor = ORANGE;
  const accentBg = ORANGE;

  // Fetch org/company/entity details
  const fetchOrganizationDetails = async (userData) => {
    if (!userData) return;
    try {
      setOrganizationDetails((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      const results = {};
      if (userData.org) {
        try {
          const orgResponse = await organnizationInstance.get(
            `organizations/${userData.org}/`
          );
          results.organization = orgResponse.data;
        } catch {}
      }
      if (userData.company_id || userData.company) {
        const companyId = userData.company_id || userData.company;
        try {
          const companyResponse = await organnizationInstance.get(
            `companies/${companyId}/`
          );
          results.company = companyResponse.data;
        } catch {}
      }
      if (userData.entity_id || userData.entity) {
        const entityId = userData.entity_id || userData.entity;
        try {
          const entityResponse = await organnizationInstance.get(
            `entities/${entityId}/`
          );
          results.entity = entityResponse.data;
        } catch {}
      }
      setOrganizationDetails({
        ...results,
        loading: false,
        error: null,
      });
    } catch (error) {
      setOrganizationDetails((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load organization details",
      }));
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("USER_DATA");
    if (userString && userString !== "undefined") {
      const parsedUserData = JSON.parse(userString);
      setUserData(parsedUserData);
      fetchOrganizationDetails(parsedUserData);
    }
    const accessString = localStorage.getItem("ACCESSES");
    if (accessString && accessString !== "undefined") {
      try {
        setAccesses(JSON.parse(accessString));
      } catch {
        setAccesses([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !userData) {
      navigate("/login", { replace: true });
    }
  }, [hydrated, userData, navigate]);

  // Extract unique roles
  let allRoles = [];
  if (Array.isArray(accesses)) {
    accesses.forEach((access) => {
      if (access.roles && Array.isArray(access.roles)) {
        access.roles.forEach((role) => {
          const roleStr = typeof role === "string" ? role : role?.role;
          if (roleStr && !allRoles.includes(roleStr)) {
            allRoles.push(roleStr);
          }
        });
      }
    });
  }

  let role = "User";
  if (userData?.superadmin || userData?.is_staff) {
    role = "Super Admin";
  } else if (userData?.is_client) {
    role = "Admin";
  } else if (userData?.is_manager) {
    role = "Manager";
  } else if (allRoles.length > 0) {
    const uniqueRoles = [...new Set(allRoles)];
    role = uniqueRoles.join(", ");
  }

  useEffect(() => {
    localStorage.setItem("ROLE", role);
  }, [role]);

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        onClose();
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setManage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Sign out logic
  const handleSignOut = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("USER_DATA");
    localStorage.removeItem("ACCESSES");
    localStorage.removeItem("ROLE");
    navigate("/login");
    if (typeof onClose === "function") onClose();
  };

  // Helper functions
  const isValidString = (value) => value && String(value).trim() !== "";
  const hasContactData = () =>
    isValidString(userData?.email) ||
    isValidString(userData?.phone_number) ||
    isValidString(userData?.date_joined) ||
    isValidString(userData?.last_login);

  const hasOrganizationData = () =>
    organizationDetails.organization ||
    organizationDetails.company ||
    organizationDetails.entity ||
    isValidString(userData?.org);

  // ---- VALUE COLOR: STRONG ORANGE (for ALL field values) ----
  const valueColor = "#bb5600"; // Strong readable orange

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-end"
      style={{
        background: "rgba(20,16,10,0.33)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        ref={profileRef}
        className="w-full max-w-md mx-auto rounded-3xl overflow-hidden max-h-[88vh] flex flex-col relative"
        style={{
          background: cardColor,
          border: `2px solid ${borderColor}`,
          color: textColor,
          boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          marginTop: "32px",
          marginRight: "32px",
        }}
      >
        {/* Orange gradient bar */}
        <div
          style={{
            width: "100%",
            height: 5,
            background: "linear-gradient(90deg, #ffbe63 30%, #ffd080 100%)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
          }}
        ></div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "#fff8f0",
            border: `1.5px solid ${borderColor}`,
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            zIndex: 40,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
          title="Close"
        >
          <span style={{ fontWeight: 700, fontSize: 21 }}>×</span>
        </button>

        {/* Header */}
        <div
          style={{
            background: bgColor,
            borderBottom: `1.5px solid ${borderColor}`,
            padding: "32px 0 18px 0",
          }}
          className="flex flex-col items-center"
        >
          {/* Profile Image or Initials */}
          {userData?.profile_image ? (
            <img
              src={userData.profile_image}
              alt="profile"
              style={{
                height: 76,
                width: 76,
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${ORANGE}`,
                marginBottom: 8,
                boxShadow: "0 0 0 3px #fff",
              }}
            />
          ) : (
            <div
              style={{
                height: 76,
                width: 76,
                borderRadius: "50%",
                background: ORANGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 32,
                border: `3px solid ${ORANGE}`,
                marginBottom: 8,
                boxShadow: "0 0 0 3px #fff",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              {getInitials(userData)}
            </div>
          )}
          <h2
            style={{
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 4,
              color: textColor,
            }}
          >
            {userData?.username}
          </h2>
          <div style={{ color: "#a37d31", fontSize: 15, marginBottom: 2 }}>
            ID: {userData?.user_id}
          </div>
          <div
            style={{
              background: accentBg,
              color: "#ad5700",
              borderRadius: 14,
              fontWeight: 600,
              fontSize: 14,
              padding: "4px 16px",
              margin: "7px 0",
              boxShadow: "0 1px 4px rgba(255,190,99,0.08)",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <FiShield size={15} style={{ color: "#ad5700" }} /> {role}
          </div>
        </div>

        {/* Scrollable content area */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5"
          style={{
            background: theme === "dark" ? "#23232c" : "#fff",
            minHeight: 160,
          }}
        >
          {/* Project Roles Section */}
          {accesses?.length > 0 && (
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: "#fff6ea",
                border: `1.2px solid ${borderColor}`,
              }}
            >
              <div
                className="flex items-center gap-2 mb-4"
                style={{ color: ORANGE }}
              >
                <FiBriefcase size={18} />
                <h3
                  className="font-semibold text-base"
                  style={{ color: "#9c670d" }}
                >
                  Project Access
                </h3>
              </div>
              <div className="space-y-3">
                {accesses.slice(0, 3).map(
                  (access, idx) =>
                    isValidString(access.project_id) && (
                      <div
                        key={idx}
                        className="rounded-xl p-4"
                        style={{
                          background: "#fff",
                          border: `1px solid ${borderColor}`,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="font-semibold text-base"
                            style={{ color: valueColor }}
                          >
                            {getProjectName(access)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {access.roles?.slice(0, 2).map((role, j) => {
                              const roleStr =
                                typeof role === "string" ? role : role?.role;
                              return isValidString(roleStr) ? (
                                <span
                                  key={j}
                                  className="px-3 py-1"
                                  style={{
                                    background: ORANGE,
                                    color: "#ad5700",
                                    borderRadius: 12,
                                    fontWeight: 600,
                                    fontSize: 12,
                                  }}
                                >
                                  {roleStr}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )
                )}
                {accesses.length > 3 && (
                  <div
                    className="text-center text-sm pt-2"
                    style={{ color: "#a86c10" }}
                  >
                    +{accesses.length - 3} more projects
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {hasContactData() && (
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: "#fff6ea",
                border: `1.2px solid ${borderColor}`,
              }}
            >
              <h3
                className="font-semibold mb-4 flex items-center gap-2 text-base"
                style={{ color: "#9c670d" }}
              >
                <FiMail size={18} />
                Contact Details
              </h3>
              <div className="space-y-3">
                {isValidString(userData?.email) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiMail size={16} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#bfa672" }}
                      >
                        Email
                      </p>
                      <p
                        className="font-semibold text-base"
                        style={{ color: valueColor }}
                      >
                        {userData.email}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.phone_number) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiPhone size={16} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#bfa672" }}
                      >
                        Phone
                      </p>
                      <p
                        className="font-semibold text-base"
                        style={{ color: valueColor }}
                      >
                        {userData.phone_number}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.date_joined) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiCalendar size={16} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#bfa672" }}
                      >
                        Joined
                      </p>
                      <p
                        className="font-semibold text-base"
                        style={{ color: valueColor }}
                      >
                        {userData.date_joined}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.last_login) && (
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: "#fff",
                      border: `1px solid ${borderColor}`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <FiClock size={16} style={{ color: iconColor }} />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#bfa672" }}
                      >
                        Last Login
                      </p>
                      <p
                        className="font-semibold text-base"
                        style={{ color: valueColor }}
                      >
                        {userData.last_login}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organization Section */}
          {hasOrganizationData() && (
            <div
              className="rounded-2xl p-5 mb-4 relative"
              ref={dropdownRef}
              style={{
                background: "#fff6ea",
                border: `1.2px solid ${borderColor}`,
              }}
            >
              <h3
                className="font-semibold mb-4 flex items-center gap-2 text-base"
                style={{ color: "#9c670d" }}
              >
                <FiBriefcase size={18} />
                Organization Details
              </h3>
              {organizationDetails.loading ? (
                <div
                  className="flex items-center justify-center p-6 rounded-xl"
                  style={{
                    background: "#fff0e1",
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                  <span
                    className="ml-3 text-sm font-medium"
                    style={{ color: "#ab7a13" }}
                  >
                    Loading organization details...
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Organization */}
                  {organizationDetails.organization && (
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "#fff",
                        border: `1px solid ${borderColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                          style={{ background: accentBg, color: "#ad5700" }}
                        >
                          {organizationDetails.organization.organization_name
                            ? organizationDetails.organization
                                .organization_name[0]
                            : "O"}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#bfa672" }}
                          >
                            Organization
                          </p>
                          <p
                            className="font-semibold text-base"
                            style={{ color: valueColor }}
                          >
                            {organizationDetails.organization
                              .organization_name || `Org ${userData.org}`}
                          </p>
                          {organizationDetails.organization.contact_email && (
                            <p
                              className="text-sm"
                              style={{ color: valueColor }}
                            >
                              {organizationDetails.organization.contact_email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Company */}
                  {organizationDetails.company && (
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "#fff",
                        border: `1px solid ${borderColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                          style={{ background: accentBg, color: "#ad5700" }}
                        >
                          {organizationDetails.company.name
                            ? organizationDetails.company.name[0]
                            : "C"}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#bfa672" }}
                          >
                            Company
                          </p>
                          <p
                            className="font-semibold text-base"
                            style={{ color: valueColor }}
                          >
                            {organizationDetails.company.name}
                          </p>
                          {(organizationDetails.company.region ||
                            organizationDetails.company.country) && (
                            <p
                              className="text-sm"
                              style={{ color: valueColor }}
                            >
                              {[
                                organizationDetails.company.region,
                                organizationDetails.company.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Entity */}
                  {organizationDetails.entity && (
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "#fff",
                        border: `1px solid ${borderColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                          style={{ background: accentBg, color: "#ad5700" }}
                        >
                          {organizationDetails.entity.name
                            ? organizationDetails.entity.name[0]
                            : "E"}
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#bfa672" }}
                          >
                            Entity
                          </p>
                          <p
                            className="font-semibold text-base"
                            style={{ color: valueColor }}
                          >
                            {organizationDetails.entity.name}
                          </p>
                          {(organizationDetails.entity.state ||
                            organizationDetails.entity.region ||
                            organizationDetails.entity.zone) && (
                            <p
                              className="text-sm"
                              style={{ color: valueColor }}
                            >
                              {[
                                organizationDetails.entity.state,
                                organizationDetails.entity.region,
                                organizationDetails.entity.zone,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Fallback: org ID only */}
                  {!organizationDetails.organization &&
                    !organizationDetails.company &&
                    !organizationDetails.entity &&
                    isValidString(userData?.org) && (
                      <button
                        onClick={() => setManage(!manage)}
                        className="w-full flex items-center justify-between p-4 rounded-xl"
                        style={{
                          background: "#fff",
                          border: `1px solid ${borderColor}`,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg"
                            style={{ background: accentBg, color: "#ad5700" }}
                          >
                            {isValidString(userData?.organization_name)
                              ? String(userData.organization_name)[0]
                              : String(userData.org)[0]}
                          </div>
                          <div className="text-left">
                            <p
                              className="font-semibold text-base"
                              style={{ color: valueColor }}
                            >
                              {userData.organization_name ||
                                `Organization ${userData.org}`}
                            </p>
                            <p className="text-sm" style={{ color: "#bfa672" }}>
                              Org ID: {userData.org}
                            </p>
                          </div>
                        </div>
                        <IoMdArrowDropdown
                          size={20}
                          style={{
                            color: iconColor,
                            transform: manage ? "rotate(180deg)" : undefined,
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                    )}
                  {/* Manage Dropdown */}
                  {manage && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl p-4 z-50"
                      style={{
                        background: cardColor,
                        border: `1.5px solid ${borderColor}`,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        animation: "slide-in-from-top .23s",
                      }}
                    >
                      <button
                        className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                        style={{
                          background: ORANGE,
                          color: "#ad5700",
                        }}
                        onClick={() =>
                          alert("Organization management coming soon!")
                        }
                      >
                        <FiSettings size={16} />
                        Manage Organization
                      </button>
                    </div>
                  )}
                </div>
              )}
              {organizationDetails.error && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "#ffeded", border: `1px solid #e96232` }}
                >
                  <p className="text-red-400 text-sm font-medium">
                    {organizationDetails.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          style={{
            background: cardColor,
            borderTop: `1.5px solid ${borderColor}`,
            padding: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
          className="flex gap-4"
        >
          <button
            className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: ORANGE,
              color: "#8a4c00",
              boxShadow: "0 2px 8px rgba(255, 190, 99, 0.15)",
              fontWeight: 700,
              fontSize: 16,
            }}
            onClick={() => alert("Account details feature coming soon!")}
          >
            <FiUser size={16} style={{ color: "#ad5700" }} /> My Account
          </button>
          <button
            className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: "#fff0e1",
              color: "#e24717",
              border: `1.5px solid #e24717`,
              fontWeight: 700,
              fontSize: 16,
            }}
            onClick={handleSignOut}
          >
            <FiLogOut size={16} style={{ color: "#e24717" }} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

