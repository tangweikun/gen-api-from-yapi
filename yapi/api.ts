import { request } from 'services';

// 评价信息分页列表
// http://192.168.192.132:3000/project/183/interface/api/20212
// 接口对接人: shanminghui
type IPageList = {
	coachname?: any; // 教练员姓名
	evaluatetimeEnd?: any; // 评价时间（止）
	evaluatetimeStart?: any; // 评价时间（起）
	idcard?: any; // 身份证号
	licnum?: any; // 车牌号
	limit: any; // 每页条数
	occupationno?: any; // 准教证号
	overall?: any; // 总体满意度
	page: any; // 当前页
	part?: any; // 培训部分
	type?: any; // 评价对象类型，1:教练员 2:培训机构
}
export async function _pageList(query: IPageList) {
  return await request(`/api/jp-train-noncore-svc/v1/schEvaluation/pageList`, "GET", query);
}
