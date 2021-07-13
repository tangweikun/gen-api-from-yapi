import { request } from 'services';

// 新增教练车接口
// http://192.168.192.132:3000/project/203/interface/api/14549
// 接口对接人: shanminghui
export async function _trainingcar(query: {  }) {
  return await request(`/api/data-exchange/v1/schBranchNetwork/getSchoolsByNetwork`, "POST", query);
}
