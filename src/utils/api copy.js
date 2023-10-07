import request from "./requestUpload";



//文章管理 新增
export const PostNewsAddAPI = (params)=> request.post('/api/news/add',params);

//文章管理 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostNewsAddAllAPI = (params)=> request.post('/api/news/addAll',params);

//文章管理 获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开 不分状态
export const PostNewsAPI = (params)=> request.post('/api/news/getByGroupName',params);

//文章管理 获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开 已发布
export const PostNewsByGroupNameStateAPI = (params)=> request.post('/api/news/getByGroupNameState',params);

//文章管理 根据id获取文章内容
export const PostNewsContentByIdAPI = (params)=> request.post('/api/news/getNewscontentById',params);

//文章管理 修改内容
export const PostNewsEditorContentAPI = (params)=> request.post('/api/news/editorContent',params);

//文章管理 修改发布状态 传入 id  state
export const PostNewsEditorStateAPI = (params)=> request.post('/api/news/editorState',params);

//文章管理 删除指定id的数据
export const PostNewsDelAPI = (params)=> request.post('/api/news/del',params);




// --------提问管理 开始------------

//提问管理 新增 Consult
export const PostConsultAddAPI = (params)=> request.post('/api/consult/add',params);

//提问管理 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostConsultAddAllAPI = (params)=> request.post('/api/consult/addAll',params);

//提问管理 获取所有数据 不分状态
export const GetConsultAPI = ()=> request.get('/api/consult/getAll');

//文章管理 获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开
export const PostConsultAPI = (params)=> request.post('/api/news/getByGroupName',params);

//提问管理 获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开
export const GetConsultByStateAPI = ()=> request.get('/api/consult/getAllByState');

//提问管理 修改内容
export const PostConsultEditorContentAPI = (params)=> request.post('/api/consult/editorContent',params);

//提问管理 修改发布状态 传入 id  state
export const PostConsultEditorStateAPI = (params)=> request.post('/api/consult/editorState',params);

//提问管理 删除指定id的数据
export const PostConsultDelAPI = (params)=> request.post('/api/consult/del',params);
// --------提问管理 结束------------



// --------轮播图 开始------------

// 新增 Carousel carousel
export const PostCarouselAddAPI = (params)=> request.post('/api/carousel/add',params);
 
// 获取所有数据 不分状态
export const GetCarouselAPI = ()=> request.get('/api/carousel/getAll');

// 获取  。传入 文章所属分类， 多个分类用|隔开。 返回已发布的
export const PostCarouselByGroupNameStateAPI  = (params)=> request.post('/api/carousel/getByGroupNameState',params);

// 获取  。传入 文章所属分类， 多个分类用|隔开。 不分状态
export const PostCarouselByGroupNameAPI = (params)=> request.post('/api/carousel/getByGroupName',params);

// 修改内容
export const PostCarouselEditorContentAPI = (params)=> request.post('/api/carousel/editorContent',params);

// 修改发布状态 传入 id  state
export const PostCarouselEditorStateAPI = (params)=> request.post('/api/carousel/editorState',params);

// 删除指定id的数据
export const PostCarouselDelAPI = (params)=> request.post('/api/carousel/del',params);

// --------轮播图 结束------------



// --------领导 开始------------

// 新增 Leader leader 
export const PostLeaderAddAPI = (params)=> request.post('/api/leader/add',params);
 
// 获取所有数据 不分状态
export const GetLeaderAPI = ()=> request.get('/api/leader/getAll');

// 获取数据  已发布
export const GetLeaderByStateAPI = ()=> request.get('/api/leader/getByState');

// 修改内容
export const PostLeaderEditorContentAPI = (params)=> request.post('/api/leader/editorContent',params);

// 修改发布状态 传入 id  state
export const PostLeaderEditorStateAPI = (params)=> request.post('/api/leader/editorState',params);

// 删除指定id的数据
export const PostLeaderDelAPI = (params)=> request.post('/api/leader/del',params);

// --------领导 结束------------


// --------简介 开始------------
// 新增 Introduction introduction 
export const PostIntroductionAddAPI = (params)=> request.post('/api/introduction/add',params);
 
// 获取所有数据 不分状态
export const GetIntroductionAPI = ()=> request.get('/api/introduction/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostIntroductionByGroupNameStateAPI  = (params)=> request.post('/api/introduction/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostIntroductionByGroupNameAPI = (params)=> request.post('/api/introduction/getByGroupName',params);

// 修改内容
export const PostIntroductionEditorContentAPI = (params)=> request.post('/api/introduction/editorContent',params);

// 修改发布状态 传入 id  state
export const PostIntroductionEditorStateAPI = (params)=> request.post('/api/introduction/editorState',params);

// 删除指定id的数据
export const PostIntroductionDelAPI = (params)=> request.post('/api/introduction/del',params);
// --------简介 结束------------


// --------三维结构 开始------------
// 新增 HumanBodyGroup humanbg 
export const PostHumanBodyGroupAddAPI = (params)=> request.post('/api/humanbg/add',params);
 
// 获取所有数据 不分状态
export const GetHumanBodyGroupAPI = ()=> request.get('/api/humanbg/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostHumanBodyGroupByGroupNameStateAPI  = (params)=> request.post('/api/humanbg/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostHumanBodyGroupByGroupNameAPI = (params)=> request.post('/api/humanbg/getByGroupName',params);

//通过id获取三维结构数据 ，返回 已发布的
export const PostHumanBodyGroupByIdAPI = (params)=> request.post('/api/humanbg/getById',params);

// 修改内容
export const PostHumanBodyGroupEditorContentAPI = (params)=> request.post('/api/humanbg/editorContent',params);

// 修改发布状态 传入 id  state
export const PostHumanBodyGroupEditorStateAPI = (params)=> request.post('/api/humanbg/editorState',params);

// 删除指定id的数据
export const PostHumanBodyGroupDelAPI = (params)=> request.post('/api/humanbg/del',params);

// 新增 HumanMenu humanmenu   ---------------------
export const PostHumanMenuAddAPI = (params)=> request.post('/api/humanmenu/add',params);

//合成为前端需要的菜单结构
export const GettHumanMenuMargeMenuAPI = ()=> request.get('/api/humanmenu/margeMenu');
 
// 获取所有数据 不分状态
export const GetHumanMenuAPI = ()=> request.get('/api/humanmenu/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostHumanMenuByGroupNameStateAPI  = (params)=> request.post('/api/humanmenu/getByGroupNameState',params);

//通过pid获取
export const PostHumanMenuByPidAPI  = (params)=> request.post('/api/humanmenu/getByPid',params);

//通过一级分类的title获取其pid
export const PostHumanMenuPidByTitleAPI  = (params)=> request.post('/api/humanmenu/getPidByTitle',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostHumanMenuByGroupNameAPI = (params)=> request.post('/api/humanmenu/getByGroupName',params);

// 修改内容
export const PostHumanMenuEditorContentAPI = (params)=> request.post('/api/humanmenu/editorContent',params);

// 修改发布状态 传入 id  state
export const PostHumanMenuEditorStateAPI = (params)=> request.post('/api/humanmenu/editorState',params);

// 删除指定id的数据
export const PostHumanMenuDelAPI = (params)=> request.post('/api/humanmenu/del',params);


// --------三维结构 结束------------


// --------领导致辞 开始------------

// 新增 LeaderSpeak leaderSpeak  
export const PostLeaderSpeakAddAPI = (params)=> request.post('/api/leaderSpeak/add',params);
 
// 获取所有数据 不分状态
export const GetLeaderSpeakAPI = ()=> request.get('/api/leaderSpeak/getAll');

//获取 已发布的
export const GetLeaderSpeakByStateAPI = ()=> request.get('/api/leaderSpeak/getByState');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostLeaderSpeakByGroupNameStateAPI  = (params)=> request.post('/api/leaderSpeak/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostLeaderSpeakByGroupNameAPI = (params)=> request.post('/api/leaderSpeak/getByGroupName',params);

// 修改内容
export const PostLeaderSpeakEditorContentAPI = (params)=> request.post('/api/leaderSpeak/editorContent',params);

// 修改发布状态 传入 id  state
export const PostLeaderSpeakEditorStateAPI = (params)=> request.post('/api/leaderSpeak/editorState',params);

// 删除指定id的数据
export const PostLeaderSpeakDelAPI = (params)=> request.post('/api/leaderSpeak/del',params);

// --------领导致辞 结束------------



// --------组织机构 开始------------

// 新增 Organization organization
export const PostOrganizationAddAPI = (params)=> request.post('/api/organization/add',params);

// 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostOrganizationAddAllAPI = (params)=> request.post('/api/organization/addAll',params);

// 获取所有数据 不分状态
export const GetOrganizationAPI = ()=> request.get('/api/organization/getAll');

// 获取  已发布数据
export const GetOrganizationByStateAPI = ()=> request.get('/api/organization/getAllByState');

// 修改内容
export const PostOrganizationEditorContentAPI = (params)=> request.post('/api/organization/editorContent',params);

// 修改发布状态 传入 id  state
export const PostOrganizationEditorStateAPI = (params)=> request.post('/api/organization/editorState',params);

// 删除指定id的数据
export const PostOrganizationDelAPI = (params)=> request.post('/api/organization/del',params);
// --------组织机构 结束------------



// --------视频管理 开始------------

// 新增 Movies   movies
export const PostMoviesAddAPI = (params)=> request.post('/api/movies/add',params);

// 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostMoviesAddAllAPI = (params)=> request.post('/api/movies/addAll',params);

// 获取所有数据 不分状态
export const GetMoviesAPI = ()=> request.get('/api/movies/getAll');

// 获取 前端调用 按分类和发布状态。 前端只能获取发布状态为1 已发布的数据
export const PostMoviesByGroupNameStateAPI = (params)=> request.post('/api/movies/getByGroupNameState',params);

// 修改内容
export const PostMoviesEditorContentAPI = (params)=> request.post('/api/movies/editorContent',params);

// 修改发布状态 传入 id  state
export const PostMoviesEditorStateAPI = (params)=> request.post('/api/movies/editorState',params);

// 删除指定id的数据
export const PostMoviesDelAPI = (params)=> request.post('/api/movies/del',params);

// --------视频管理 结束------------



// --------建议意见管理 开始------------

// 新增 Propose propose  
export const PostProposeAddAPI = (params)=> request.post('/api/propose/add',params);

// 获取所有数据 不分状态
export const GetProposeAPI = ()=> request.get('/api/propose/getAll');
 
// 删除指定id的数据
export const PostProposeDelAPI = (params)=> request.post('/api/propose/del',params);

// --------建议意见管理 结束------------

// --------预约管理 开始------------

// 新增 Appointment appointment  
export const PostAppointmentAddAPI = (params)=> request.post('/api/appointment/add',params);

// 获取所有数据 不分状态
export const GetAppointmentAPI = ()=> request.get('/api/appointment/getAll');

export const PostAppointmentByPhoneAPI = (params)=> request.post('/api/appointment/getByPhone',params);
 
// 删除指定id的数据
export const PostAppointmentDelAPI = (params)=> request.post('/api/appointment/del',params);

// --------预约管理 结束------------

// --------用户管理 开始------------

// 新增 User   user
export const PostUserAddAPI = (params)=> request.post('/api/user/add',params);
//注册
export const PostUserRegisterAPI = (params)=> request.post('/api/user/register',params);
//手机号+短信验证注册
export const PostUserregisterPhoneAPI = (params)=> request.post('/api/user/registerPhone',params);

//修改手机号的旧手机验证码
export const PostUpdatePhoneAPI = (params)=> request.post('/api/user/updatePhone',params);

//登录
export const PostUserLoginAPI = (params)=> request.post('/api/user/login',params);

//手机号登录
export const PostUserLoginPhoneAPI = (params)=> request.post('/api/user/loginPhone',params);

// 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostUserAddAllAPI = (params)=> request.post('/api/user/addAll',params);

// 获取所有数据 不分状态
export const GetUserAPI = ()=> request.get('/api/user/getAll');

//手机号查找用户信息
export const GetUserByPhonePI = (params)=> request.post('/api/user/getUserByPhone',params);

// 获取 前端调用 按分类和发布状态。 前端只能获取发布状态为1 已发布的数据
export const PostUserByGroupNameStateAPI = (params)=> request.post('/api/user/getByGroupNameState',params);

// 修改内容
export const PostUserEditorContentAPI = (params)=> request.post('/api/user/editorContent',params);

// 修改发布状态 传入 id  state
export const PostUserEditorStateAPI = (params)=> request.post('/api/user/editorState',params);

// 删除指定id的数据
export const PostUserDelAPI = (params)=> request.post('/api/user/del',params);

// --------用户管理 结束------------




//加载文本内容
export const LoadFile = (params)=> request.post('/api/loadPanelData',params);
//保存文本内容
export const SavePanelData = (params)=> request.post('/api/savePanelData',params);

//上传图片。返回新的图片名
export const SaveImgGetFileName = (params)=> request.post('/api/SaveImgGetFileName',params);

//上传文本，返回新的文本名
export const SaveTxtGetFileName = (params)=> request.post('/api/SaveTxtGetFileName',params);

//保存为本地数据
export const SaveAdminIndexAPI = (params)=> request.post('/api/SaveAdminIndex',params);


//阿里云短信服务。 发送短信验证
export const SendSmsCodeAPI = (params)=> request.post('/api/sendCode',params);


//阿里云 对象存储 0SS 服务。  
export const SaveFileOSSAPI = (params)=> request.post('/api/saveFileOSS',params);

//删除文件
export const DelFileAPI = (params)=> request.post('/api/DelFile',params);
//删除文件 OSS
export const DeleteFileOSS = (params)=> request.post('/api/deleteFileOSS',params);


// this.dialogVisible = false; 
// this.form.state = 0; 
// this.contentItemData = editor.txt.html();
// this.form.articleContent = this.contentItemData ;
// const response = await this.$axios.post("/api/news/add", this.form);

// fromData.append("groupList", list);
// let config = {
//   headers: {
//     "Content-Type": "application/json", 
//   },
// };
// this.$axios.post("/api/news/getByGroupName",fromData,config).then((response) => {
//   console.log(response.data);
// });

