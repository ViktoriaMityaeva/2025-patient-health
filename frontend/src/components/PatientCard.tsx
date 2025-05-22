// import React from 'react';
// import { Patient } from '../types/patient';
// import { User, Calendar, Phone, Mail, Activity } from 'lucide-react';
//
// interface PatientCardProps {
//   patient: Patient;
//   onClick: (patient: Patient) => void;
// }
//
// export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
//   return (
//     <div
//       onClick={() => onClick(patient)}
//       className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-4">
//           <div className="bg-blue-50 p-3 rounded-full">
//             <User className="w-6 h-6 text-blue-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
//             <p className="text-sm text-gray-500">ID: {patient.id}</p>
//           </div>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-sm ${
//           patient.status === 'active'
//             ? 'bg-green-50 text-green-700'
//             : 'bg-gray-50 text-gray-700'
//         }`}>
//           {patient.status}
//         </span>
//       </div>
//
//       <div className="mt-4 grid grid-cols-2 gap-4">
//         <div className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-600">{patient.dateOfBirth}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Phone className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-600">{patient.phone}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Mail className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-600">{patient.email}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Activity className="w-4 h-4 text-gray-400" />
//           <span className="text-sm text-gray-600">Last visit: {patient.lastVisit}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
