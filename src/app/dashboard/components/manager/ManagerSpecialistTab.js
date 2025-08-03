import React, { useState, useEffect, useContext } from 'react';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import zoneService from '@/services/api/zoneService';
import { AuthContext } from '@/context/AuthContext';

const ManagerSpecialistTab = () => {
  //   const { user } = useContext(AuthContext);
  //   const currentManagerId = user?.AccountID;

  //   const [showDetail, setShowDetail] = useState(false);
  //   const [detailData, setDetailData] = useState(null);
  //   const [showCreateModal, setShowCreateModal] = useState(false);
  //   const [avatarUrl, setAvatarUrl] = useState('');
  //   const [avatarPreview, setAvatarPreview] = useState('');
  //   const [fullName, setFullName] = useState('');
  //   const [email, setEmail] = useState('');
  //   const [phone, setPhone] = useState('');
  //   const [password, setPassword] = useState('');
  //   const [specialistList, setSpecialistList] = useState([]);
  //   const [editStatus, setEditStatus] = useState('');
  //   const [gender, setGender] = useState('');
  //   const [dob, setDob] = useState('');
  //   const [zoneId, setZoneId] = useState('');
  //   const [experience, setExperience] = useState('');
  //   const [slogan, setSlogan] = useState('');
  //   const [address, setAddress] = useState('');
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [accounts, setAccounts] = useState([]);
  //   const [nursingSpecialists, setNursingSpecialists] = useState([]);
  //   const [zones, setZones] = useState([]);
  //   const major = 'Chuyên gia';

  //   // Fetch data from API
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         setLoading(true);
  //         const [accountsData, nursingSpecialistsData, zonesData] = await Promise.all([
  //           accountService.getAllAccounts(),
  //           nursingSpecialistService.getAllNursingSpecialists(),
  //           zoneService.getZones()
  //         ]);

  //         setAccounts(accountsData);
  //         setNursingSpecialists(nursingSpecialistsData);
  //         setZones(zonesData);
  //       } catch (err) {
  //         console.error('Error fetching data:', err);
  //         setError('Không thể tải dữ liệu. Vui lòng thử lại.');
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     if (currentManagerId) {
  //       fetchData();
  //     }
  //   }, [currentManagerId]);

  //   // Lấy khu vực mà manager hiện tại quản lý
  //   const getManagedZone = () => {
  //     if (!currentManagerId) return null;
  //     return zones.find(zone => zone.AccountID === currentManagerId);
  //   };

  //   // Lọc specialist thuộc khu vực quản lý của manager
  //   const getSpecialistsInManagedZone = () => {
  //     const managedZone = getManagedZone();
  //     if (!managedZone) return [];

  //     // Lấy danh sách specialist thuộc khu vực quản lý
  //     const specialistsInZone = nursingSpecialists.filter(ns => 
  //       ns.ZoneID === managedZone.ZoneID && ns.Major === 'Chuyên gia'
  //     );

  //     // Lấy thông tin account của các specialist này
  //     const specialistAccounts = accounts.filter(acc => 
  //       acc.role_id === 2 && specialistsInZone.some(ns => ns.AccountID === acc.AccountID)
  //     );

  //     return specialistAccounts;
  //   };

  //   useEffect(() => {
  //     if (currentManagerId && accounts.length > 0 && nursingSpecialists.length > 0 && zones.length > 0) {
  //       const filteredSpecialists = getSpecialistsInManagedZone();
  //       setSpecialistList(filteredSpecialists);
  //       // Set zoneId mặc định là khu vực quản lý của manager
  //       const managedZone = getManagedZone();
  //       if (managedZone) {
  //         setZoneId(managedZone.ZoneID.toString());
  //       }
  //     }
  //   }, [currentManagerId, accounts, nursingSpecialists, zones]);

  //   const handleView = (specialist) => {
  //     const detail = nursingSpecialists.find(n => n.AccountID === specialist.AccountID);
  //     setDetailData({ ...specialist, ...detail });
  //     setEditStatus(specialist.status);
  //     setShowDetail(true);
  //   };

  //   const handleCloseDetail = () => {
  //     setShowDetail(false);
  //     setDetailData(null);
  //   };

  //   const handleCreateSpecialistClick = () => setShowCreateModal(true);
  //   const handleCloseCreateModal = () => {
  //     setShowCreateModal(false);
  //     setAvatarUrl(''); setAvatarPreview(''); setFullName(''); setEmail(''); setPhone(''); setPassword('');
  //     setGender(''); setDob(''); setZoneId(''); setExperience(''); setSlogan(''); setAddress('');
  //   };
  //   const handleAvatarChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setAvatarPreview(reader.result);
  //         setAvatarUrl('');
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };
  //   const handleAvatarUrlChange = (e) => {
  //     setAvatarUrl(e.target.value);
  //     setAvatarPreview('');
  //   };
  //   const handleCreateSpecialistSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       setLoading(true);

  //       // Tạo accountData và nursingSpecialistData
  //       const accountData = {
  //         full_name: fullName,
  //         email,
  //         phone_number: phone,
  //         avatar_url: avatarUrl || avatarPreview,
  //         role_id: 2,
  //         role_name: 'Chuyên gia',
  //         status: 'active',
  //         password,
  //       };

  //       // Đăng ký account trước
  //       const accountResult = await accountService.registerNursingSpecialist(accountData);

  //       if (accountResult && accountResult.AccountID) {
  //         // Tạo nursing specialist data
  //         const nursingSpecialistData = {
  //           AccountID: accountResult.AccountID,
  //           ZoneID: parseInt(zoneId),
  //           Gender: gender,
  //           DateOfBirth: dob,
  //           Major: major,
  //           Experience: experience,
  //           Slogan: slogan,
  //           Address: address,
  //           Status: 'active',
  //         };

  //         // Tạo nursing specialist
  //         await nursingSpecialistService.createNursingSpecialist(nursingSpecialistData);

  //         // Refresh data
  //         const [accountsData, nursingSpecialistsData] = await Promise.all([
  //           accountService.getAllAccounts(),
  //           nursingSpecialistService.getAllNursingSpecialists()
  //         ]);

  //         setAccounts(accountsData);
  //         setNursingSpecialists(nursingSpecialistsData);

  //         // Reset form
  //         setFullName('');
  //         setEmail('');
  //         setPhone('');
  //         setPassword('');
  //         setAvatarUrl('');
  //         setAvatarPreview('');
  //         setGender('');
  //         setDob('');
  //         setExperience('');
  //         setSlogan('');
  //         setAddress('');

  //         alert('Tạo specialist thành công!');
  //         handleCloseCreateModal();
  //       }
  //     } catch (error) {
  //       console.error('Error creating specialist:', error);
  //       alert(`Lỗi tạo specialist: ${error.message}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Đổi trạng thái specialist
  //   const handleToggleStatus = async (accountId) => {
  //     try {
  //       const currentSpecialist = specialistList.find(s => s.AccountID === accountId);
  //       const newStatus = currentSpecialist.status === 'active' ? 'inactive' : 'active';

  //       // Gọi API để cập nhật trạng thái
  //       await accountService.updateAccount(accountId, { status: newStatus });

  //       // Cập nhật local state
  //       setSpecialistList(prev => prev.map(s => 
  //         s.AccountID === accountId ? { ...s, status: newStatus } : s
  //       ));

  //       alert(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} specialist thành công!`);
  //     } catch (error) {
  //       console.error('Error updating specialist status:', error);
  //       alert(`Lỗi cập nhật trạng thái: ${error.message}`);
  //     }
  //   };

  //   // Xác nhận đổi trạng thái trong popup
  //   const handleConfirmStatus = async () => {
  //     try {
  //       // Gọi API để cập nhật trạng thái
  //       await accountService.updateAccount(detailData.AccountID, { status: editStatus });

  //       // Cập nhật local state
  //       setSpecialistList(prev => prev.map(s => 
  //         s.AccountID === detailData.AccountID ? { ...s, status: editStatus } : s
  //       ));

  //       setShowDetail(false);
  //       setDetailData(null);
  //       alert('Cập nhật trạng thái thành công!');
  //     } catch (error) {
  //       console.error('Error updating specialist status:', error);
  //       alert(`Lỗi cập nhật trạng thái: ${error.message}`);
  //     }
  //   };

  //   if (loading) {
  //     return (
  //       <div className="flex justify-center items-center h-64">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
  //           <p className="text-gray-600">Đang tải dữ liệu...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <div className="flex justify-center items-center h-64">
  //         <div className="text-center">
  //           <div className="text-red-500 mb-4">⚠️</div>
  //           <p className="text-red-600">{error}</p>
  //           <button 
  //             onClick={() => window.location.reload()} 
  //             className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
  //           >
  //             Thử lại
  //           </button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div>
  //       <div className="flex justify-between items-center mb-4">
  //         <h3 className="text-xl font-semibold">Danh sách Specialist</h3>
  //         <button
  //           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg"
  //           onClick={handleCreateSpecialistClick}
  //         >
  //           Thêm mới
  //         </button>
  //       </div>
  //       {/* Popup tạo specialist */}
  //       {showCreateModal && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto">
  //           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-2 md:p-4 relative my-6 mx-2">
  //             <div className="top-0 bg-white z-10 flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
  //               <h3 className="text-lg md:text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 flex-1">Tạo tài khoản mới</h3>
  //               <button
  //                 className="ml-2 text-gray-400 hover:text-pink-500 text-2xl font-bold"
  //                 onClick={handleCloseCreateModal}
  //                 aria-label="Đóng"
  //                 type="button"
  //               >
  //                 &times;
  //               </button>
  //             </div>
  //             <form onSubmit={handleCreateSpecialistSubmit} className="space-y-4">
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
  //                 <div className="space-y-4">
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
  //                     <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Nhập họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
  //                     <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Nhập email" value={email} onChange={e => setEmail(e.target.value)} />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
  //                     <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Nhập số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
  //                     <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
  //                   </div>
  //                 </div>
  //                 {/* Avatar */}
  //                 <div className="flex flex-col items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg p-4 shadow-sm">
  //                   <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
  //                   <div className="relative w-20 h-20 mb-1">
  //                     <img src={avatarPreview || avatarUrl || "/images/logo-eldora.png"} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-pink-200 mx-auto" />
  //                     <label className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-pink-600 transition" title="Đổi ảnh">
  //                       <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
  //                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  //                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
  //                       </svg>
  //                     </label>
  //                   </div>
  //                   <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Dán URL ảnh đại diện" value={avatarUrl} onChange={handleAvatarUrlChange} />
  //                 </div>
  //               </div>
  //               {/* Card chuyên môn full width */}
  //               <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2 space-y-2 shadow-sm">
  //                 <div className="font-semibold text-purple-700 mb-1 text-base">Thông tin chuyên môn</div>
  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
  //                   <div>
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Khu vực làm việc (Quận)</label>
  //                     <select required className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={zoneId} onChange={e => setZoneId(e.target.value)}>
  //                       <option value="" hidden>Chọn khu vực</option>
  //                       {(() => {
  //                         const managedZone = getManagedZone();
  //                         return managedZone ? (
  //                           <option key={managedZone.ZoneID} value={managedZone.ZoneID}>{managedZone.Zone_name}</option>
  //                         ) : null;
  //                       })()}
  //                     </select>
  //                   </div>
  //                   <div>
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Giới tính</label>
  //                     <select required className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={gender} onChange={e => setGender(e.target.value)}>
  //                       <option value="" hidden>Chọn giới tính</option>
  //                       <option value="Nam">Nam</option>
  //                       <option value="Nữ">Nữ</option>
  //                       <option value="Khác">Khác</option>
  //                     </select>
  //                   </div>
  //                   <div>
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Ngày sinh</label>
  //                     <input type="date" required className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={dob} onChange={e => setDob(e.target.value)} />
  //                   </div>
  //                   <div>
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Chuyên ngành</label>
  //                     <input type="text" required className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={major} readOnly />
  //                   </div>
  //                   <div>
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Kinh nghiệm (năm)</label>
  //                     <input type="number" min="0" required className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={experience} onChange={e => setExperience(e.target.value)} />
  //                   </div>
  //                   <div>
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Slogan</label>
  //                     <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={slogan} onChange={e => setSlogan(e.target.value)} />
  //                   </div>
  //                   <div className="md:col-span-2">
  //                     <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
  //                     <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300" value={address} onChange={e => setAddress(e.target.value)} />
  //                   </div>
  //                 </div>
  //               </div>
  //               <div className="pt-2 flex flex-col md:flex-row md:justify-end">
  //                 <button type="submit" className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg mt-2 md:mt-0">Lưu</button>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       )}
  //       {/* Popup chi tiết specialist */}
  //       {showDetail && detailData && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
  //           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
  //             <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>&times;</button>
  //             <div className="flex flex-col items-center mb-4">
  //               <div className="w-24 h-24 rounded-full border-4 border-pink-300 overflow-hidden mb-2">
  //                 <img src={detailData.avatar_url && detailData.avatar_url !== 'string' ? detailData.avatar_url : '/images/logo-eldora.png'} alt="avatar" className="object-cover w-full h-full" />
  //               </div>
  //               <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1">{detailData.full_name || 'Không có'}</h3>
  //               <div className="flex items-center gap-2 mt-2">
  //                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${editStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{editStatus === 'active' ? 'Đang hoạt động' : 'Vô hiệu hóa'}</span>
  //                 <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="ml-2 px-2 py-1 rounded border focus:ring-2 focus:ring-purple-400">
  //                   <option value="active">Đang hoạt động</option>
  //                   <option value="inactive">Vô hiệu hóa</option>
  //                 </select>
  //                 <button onClick={handleConfirmStatus} className="ml-2 px-3 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs hover:shadow-lg">Xác nhận</button>
  //               </div>
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
  //               <div className="font-medium text-gray-600">Email:</div>
  //               <div>{detailData.email || 'Không có'}</div>
  //               <div className="font-medium text-gray-600">Số điện thoại:</div>
  //               <div>{detailData.phone_number || 'Không có'}</div>
  //               <div className="font-medium text-gray-600">Địa chỉ:</div>
  //               <div>{detailData.Address || 'Không có'}</div>
  //               <div className="font-medium text-gray-600">Kinh nghiệm:</div>
  //               <div>{detailData.Experience || 'Không có'} năm</div>
  //               <div className="font-medium text-gray-600">Chuyên ngành:</div>
  //               <div>{detailData.Major || 'Không có'}</div>
  //               <div className="font-medium text-gray-600">Slogan:</div>
  //               <div>{detailData.Slogan || 'Không có'}</div>
  //               <div className="font-medium text-gray-600">Giới tính:</div>
  //               <div>{detailData.Gender || 'Không có'}</div>
  //               <div className="font-medium text-gray-600">Ngày sinh:</div>
  //               <div>{detailData.DateOfBirth || 'Không có'}</div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //       <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
  //         <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
  //           <tr>
  //             <th className="px-6 py-3 text-left">Tên</th>
  //             <th className="px-6 py-3 text-left">Email</th>
  //             <th className="px-6 py-3 text-left">Trạng thái</th>
  //             <th className="px-6 py-3 text-left">Thao tác</th>
  //           </tr>
  //         </thead>
  //         <tbody className="divide-y divide-gray-200">
  //           {specialistList.map(specialist => (
  //             <tr key={specialist.AccountID} className="hover:bg-gray-50">
  //               <td className="px-6 py-4">{specialist.full_name}</td>
  //               <td className="px-6 py-4">{specialist.email}</td>
  //               <td className="px-6 py-4">
  //                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${specialist.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{specialist.status}</span>
  //               </td>
  //               <td className="px-6 py-4">
  //                 <button onClick={() => handleView(specialist)} className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600">Xem chi tiết</button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  return (
    <div>
      <h1>Specialist</h1>
    </div>
  );
};



export default ManagerSpecialistTab; 