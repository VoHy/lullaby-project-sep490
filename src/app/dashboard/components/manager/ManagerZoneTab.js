import { useEffect, useState } from 'react';
import zoneService from '@/services/api/zoneService';
import nursingSpecialists from '@/mock/NursingSpecialist';

const ManagerZoneTab = () => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [zoneNurses, setZoneNurses] = useState([]);
    const [zoneSpecialists, setZoneSpecialists] = useState([]);
    const [detailModal, setDetailModal] = useState({ open: false, data: null, type: '' });

    useEffect(() => {
        zoneService.getZones().then(setZones);
    }, []);

    // Lọc nurse và specialist theo khu vực và địa chỉ
    useEffect(() => {
        let nurses = nursingSpecialists.filter(n => n.NursingID);
        let specialists = nursingSpecialists.filter(s => s.SpecialistID);
        if (selectedZone) {
            nurses = nurses.filter(n => n.ZoneID == selectedZone);
            specialists = specialists.filter(s => s.ZoneID == selectedZone);
        }
        if (searchTerm.trim()) {
            const lowerTerm = searchTerm.toLowerCase();
            nurses = nurses.filter(n => n.Address && n.Address.toLowerCase().includes(lowerTerm));
            specialists = specialists.filter(s => s.Address && s.Address.toLowerCase().includes(lowerTerm));
        }
        // Nếu không chọn khu vực và không search, render toàn bộ
        setZoneNurses(nurses);
        setZoneSpecialists(specialists);
    }, [selectedZone, searchTerm]);

    // Hiển thị modal chi tiết
    const showDetail = (data, type) => {
        setDetailModal({ open: true, data, type });
    };
    const closeModal = () => setDetailModal({ open: false, data: null, type: '' });

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Tìm kiếm nhân sự theo khu vực & địa chỉ</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Khu vực</label>
                    <select
                        className="border rounded px-3 py-2 w-full"
                        value={selectedZone}
                        onChange={e => setSelectedZone(e.target.value)}
                    >
                        <option value="">Tất cả khu vực</option>
                        {zones.map(z => (
                            <option key={z.ZoneID} value={z.ZoneID}>{z.Zone_name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                    <input
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Nhập địa chỉ..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded hover:shadow-lg">Danh sách Nurse</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg shadow text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-3 text-left">Tên</th>
                                    <th className="py-2 px-3 text-left">Địa chỉ</th>
                                    <th className="py-2 px-3 text-left">Kinh nghiệm</th>
                                    <th className="py-2 px-3 text-left">Trạng thái</th>
                                    <th className="py-2 px-3 text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zoneNurses.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center text-gray-500 py-4">Không có nurse nào phù hợp.</td></tr>
                                ) : (
                                    zoneNurses.map(n => (
                                        <tr key={n.NursingID} className="hover:bg-purple-50 transition cursor-pointer">
                                            <td className="py-2 px-3 font-bold">{n.Nurse_Name}</td>
                                            <td className="py-2 px-3">{n.Address}</td>
                                            <td className="py-2 px-3">{n.Experience} năm</td>
                                            <td className="py-2 px-3">{n.Status}</td>
                                            <td className="py-2 px-3 text-center">
                                                <button onClick={() => showDetail(n, 'nurse')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded hover:shadow-lg">Xem chi tiết</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h4 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded hover:shadow-lg">Danh sách Specialist</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg shadow text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-3 text-left">Tên</th>
                                    <th className="py-2 px-3 text-left">Địa chỉ</th>
                                    <th className="py-2 px-3 text-left">Kinh nghiệm</th>
                                    <th className="py-2 px-3 text-left">Trạng thái</th>
                                    <th className="py-2 px-3 text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zoneSpecialists.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center text-gray-500 py-4">Không có specialist nào phù hợp.</td></tr>
                                ) : (
                                    zoneSpecialists.map(s => (
                                        <tr key={s.SpecialistID} className="hover:bg-purple-50 transition cursor-pointer">
                                            <td className="py-2 px-3 font-bold">{s.Specialist_Name}</td>
                                            <td className="py-2 px-3">{s.Address}</td>
                                            <td className="py-2 px-3">{s.Experience} năm</td>
                                            <td className="py-2 px-3">{s.Status}</td>
                                            <td className="py-2 px-3 text-center">
                                                <button onClick={() => showDetail(s, 'specialist')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded hover:shadow-lg">Xem chi tiết</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal chi tiết */}
            {detailModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in border border-purple-200">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={detailModal.data.avatar_url || "/images/avatar1.jpg"}
                                alt="avatar"
                                className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow mb-2"
                            />
                            <h3 className="text-xl font-bold mb-1 text-purple-700">
                                {detailModal.type === 'nurse' ? detailModal.data.Nurse_Name : detailModal.data.Specialist_Name}
                            </h3>
                            <span className="text-xs text-gray-500 mb-2">{detailModal.type === 'nurse' ? 'Nurse' : 'Specialist'}</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div><span className="font-semibold">Địa chỉ:</span> {detailModal.data.Address}</div>
                            <div><span className="font-semibold">Kinh nghiệm:</span> {detailModal.data.Experience} năm</div>
                            <div><span className="font-semibold">Trạng thái:</span> <span className={detailModal.data.Status === 'active' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{detailModal.data.Status}</span></div>
                            <div><span className="font-semibold">Giới tính:</span> {detailModal.data.Gender}</div>
                            <div><span className="font-semibold">Ngày sinh:</span> {detailModal.data.DateOfBirth}</div>
                            <div><span className="font-semibold">Chuyên ngành:</span> {detailModal.data.Major}</div>
                            <div><span className="font-semibold">Slogan:</span> <span className="italic text-purple-500">{detailModal.data.Slogan}</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerZoneTab; 