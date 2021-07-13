import { request } from 'services';

// 投诉信息查询接口
// http://192.168.192.132:3000/project/203/interface/api/14927
// 接口对接人: shanminghui
export async function _complaintQuery(query: { queryDate: any }) {
  return await request(`/api/data-exchange/v1/schBranchNetwork/getSchoolsByNetwork`, "GET", query);
}
