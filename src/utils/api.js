import request from "./requestUpload";



//文章管理 新增
export const PostNewsAddAPI = (params)=> request.post('/news/add',params);

//文章管理 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostNewsAddAllAPI = (params)=> request.post('/news/addAll',params);

//文章管理 获取 文章简介数据 。传入 文章所属分类， 多个分类用|隔开 ,传入状态参数
export const PostNewsAPI = (params)=> request.post('/news/getByGroupName',params);

//文章管理 根据id获取文章内容
export const PostNewsContentByIdAPI = (params)=> request.post('/news/getNewscontentById',params);

//文章管理 修改内容
export const PostNewsEditorContentAPI = (params)=> request.post('/news/editorContent',params);

//文章管理 修改发布状态 传入 id  state
export const PostNewsEditorStateAPI = (params)=> request.post('/news/editorState',params);

//文章管理 删除指定id的数据
export const PostNewsDelAPI = (params)=> request.post('/news/del',params);




// --------提问管理 开始------------

//提问管理 新增 Consult
export const PostConsultAddAPI = (params)=> request.post('/consult/add',params);

//提问管理 分页查询。传入username searchText  分页  状态
export const PostConsultAPI = (params)=> request.post('/consult/getAll',params);

//提问管理 修改内容
export const PostConsultEditorContentAPI = (params)=> request.post('/consult/editorContent',params);

//提问管理 修改发布状态 传入 id  state
export const PostConsultEditorStateAPI = (params)=> request.post('/consult/editorState',params);

//提问管理 删除指定id的数据
export const PostConsultDelAPI = (params)=> request.post('/consult/del',params);
// --------提问管理 结束------------



// --------轮播图 开始------------

// 新增 Carousel carousel
export const PostCarouselAddAPI = (params)=> request.post('/carousel/add',params);
 
// 获取所有数据 不分状态
export const GetCarouselAPI = ()=> request.get('/carousel/getAll');

// 获取  。传入 文章所属分类， 多个分类用|隔开。 返回已发布的
export const PostCarouselByGroupNameStateAPI  = (params)=> request.post('/carousel/getByGroupNameState',params);

// 获取  。传入 文章所属分类， 多个分类用|隔开。 不分状态
export const PostCarouselByGroupNameAPI = (params)=> request.post('/carousel/getByGroupName',params);

// 修改内容
export const PostCarouselEditorContentAPI = (params)=> request.post('/carousel/editorContent',params);

// 修改发布状态 传入 id  state
export const PostCarouselEditorStateAPI = (params)=> request.post('/carousel/editorState',params);

// 删除指定id的数据
export const PostCarouselDelAPI = (params)=> request.post('/carousel/del',params);

// --------轮播图 结束------------



// --------领导 开始------------

// 新增 Leader leader 
export const PostLeaderAddAPI = (params)=> request.post('/leader/add',params);
 
// 获取所有数据 不分状态
export const GetLeaderAPI = ()=> request.get('/leader/getAll');

// 获取数据  已发布
export const GetLeaderByStateAPI = ()=> request.get('/leader/getByState');

// 修改内容
export const PostLeaderEditorContentAPI = (params)=> request.post('/leader/editorContent',params);

// 修改发布状态 传入 id  state
export const PostLeaderEditorStateAPI = (params)=> request.post('/leader/editorState',params);

// 删除指定id的数据
export const PostLeaderDelAPI = (params)=> request.post('/leader/del',params);

// --------领导 结束------------


// --------简介 开始------------
// 新增 Introduction introduction 
export const PostIntroductionAddAPI = (params)=> request.post('/introduction/add',params);
 
// 获取所有数据 不分状态
export const GetIntroductionAPI = ()=> request.get('/introduction/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostIntroductionByGroupNameStateAPI  = (params)=> request.post('/introduction/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostIntroductionByGroupNameAPI = (params)=> request.post('/introduction/getByGroupName',params);

// 修改内容
export const PostIntroductionEditorContentAPI = (params)=> request.post('/introduction/editorContent',params);

// 修改发布状态 传入 id  state
export const PostIntroductionEditorStateAPI = (params)=> request.post('/introduction/editorState',params);

// 删除指定id的数据
export const PostIntroductionDelAPI = (params)=> request.post('/introduction/del',params);
// --------简介 结束------------

// --------题库 开始------------
// 新增 Examination examination   
export const PostExaminationAddAPI = (params)=> request.post('/examination/add',params);
//指定id 新增
export const PostExaminationAddByIdAPI = (params)=> request.post('/examination/addById',params);
  
// 获取.  String question,String searchText,int current,int size,int state
export const PosExaminationGetAllAPI  = (params)=> request.post('/examination/getAll',params);

// 修改内容
export const PostExaminationEditorContentAPI = (params)=> request.post('/examination/editorContent',params);

// 修改发布状态 传入 id  state
export const PostExaminationEditorStateAPI = (params)=> request.post('/examination/editorState',params);

// 删除指定id的数据
export const PostExaminationDelAPI = (params)=> request.post('/examination/del',params);
// --------题库 结束------------

// --------三维结构 开始------------
// 新增 HumanBodyGroup humanbg 
export const PostHumanBodyGroupAddAPI = (params)=> request.post('/humanbg/add',params);
//指定id 新增
export const PostHumanBodyGroupAddByIdAPI = (params)=> request.post('/humanbg/addByID',params);
 
// 获取所有数据 不分状态
export const GetHumanBodyGroupAPI = ()=> request.get('/humanbg/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostHumanBodyGroupByGroupNameStateAPI  = (params)=> request.post('/humanbg/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostHumanBodyGroupByGroupNameAPI = (params)=> request.post('/humanbg/getByGroupName',params);

//通过id获取三维结构数据 ，返回 已发布的
export const PostHumanBodyGroupByIdAPI = (params)=> request.post('/humanbg/getById',params);

// 修改内容
export const PostHumanBodyGroupEditorContentAPI = (params)=> request.post('/humanbg/editorContent',params);

// 修改发布状态 传入 id  state
export const PostHumanBodyGroupEditorStateAPI = (params)=> request.post('/humanbg/editorState',params);

// 删除指定id的数据
export const PostHumanBodyGroupDelAPI = (params)=> request.post('/humanbg/del',params);


// 新增 HumanModel humanModel ---------------
export const PostHumanModelAddAPI = (params)=> request.post('/humanModel/add',params);
 
// 获取所有数据 不分状态
export const GetHumanModelAPI = ()=> request.get('/humanModel/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostHumanModelByGroupNameStateAPI  = (params)=> request.post('/humanModel/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostHumanModelByGroupNameAPI = (params)=> request.post('/humanModel/getModel',params);

//通过id获取三维结构数据 ，返回 已发布的
export const PostHumanModelByIdAPI = (params)=> request.post('/humanModel/getById',params);

// 修改内容
export const PostHumanModelEditorContentAPI = (params)=> request.post('/humanModel/editorContent',params);

// 修改发布状态 传入 id  state
export const PostHumanModelEditorStateAPI = (params)=> request.post('/humanModel/editorState',params);

// 删除指定id的数据
export const PostHumanModelDelAPI = (params)=> request.post('/humanModel/del',params);



// 新增 HumanMenu humanmenu   ---------------------
export const PostHumanMenuAddAPI = (params)=> request.post('/humanmenu/add',params);

//合成为前端需要的菜单结构
export const GettHumanMenuMargeMenuAPI = ()=> request.get('/humanmenu/margeMenu');
 
// 获取所有数据 不分状态
export const GetHumanMenuAPI = ()=> request.get('/humanmenu/getAll');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostHumanMenuByGroupNameStateAPI  = (params)=> request.post('/humanmenu/getByGroupNameState',params);

//通过pid获取
export const PostHumanMenuByPidAPI  = (params)=> request.post('/humanmenu/getByPid',params);

//通过一级分类的title获取其pid
export const PostHumanMenuPidByTitleAPI  = (params)=> request.post('/humanmenu/getPidByTitle',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostHumanMenuByGroupNameAPI = (params)=> request.post('/humanmenu/getByGroupName',params);

// 修改内容
export const PostHumanMenuEditorContentAPI = (params)=> request.post('/humanmenu/editorContent',params);

// 修改发布状态 传入 id  state
export const PostHumanMenuEditorStateAPI = (params)=> request.post('/humanmenu/editorState',params);

// 删除指定id的数据
export const PostHumanMenuDelAPI = (params)=> request.post('/humanmenu/del',params);


// --------三维结构 结束------------


// --------领导致辞 开始------------

// 新增 LeaderSpeak leaderSpeak  
export const PostLeaderSpeakAddAPI = (params)=> request.post('/leaderSpeak/add',params);
 
// 获取所有数据 不分状态
export const GetLeaderSpeakAPI = ()=> request.get('/leaderSpeak/getAll');

//获取 已发布的
export const GetLeaderSpeakByStateAPI = ()=> request.get('/leaderSpeak/getByState');

// 获取  。传入 所属分类， 多个分类用|隔开。 返回已发布的
export const PostLeaderSpeakByGroupNameStateAPI  = (params)=> request.post('/leaderSpeak/getByGroupNameState',params);

// 获取  。传入 所属分类， 多个分类用|隔开。 不分状态
export const PostLeaderSpeakByGroupNameAPI = (params)=> request.post('/leaderSpeak/getByGroupName',params);

// 修改内容
export const PostLeaderSpeakEditorContentAPI = (params)=> request.post('/leaderSpeak/editorContent',params);

// 修改发布状态 传入 id  state
export const PostLeaderSpeakEditorStateAPI = (params)=> request.post('/leaderSpeak/editorState',params);

// 删除指定id的数据
export const PostLeaderSpeakDelAPI = (params)=> request.post('/leaderSpeak/del',params);

// --------领导致辞 结束------------



// --------组织机构 开始------------

// 新增 Organization organization
export const PostOrganizationAddAPI = (params)=> request.post('/organization/add',params);

// 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostOrganizationAddAllAPI = (params)=> request.post('/organization/addAll',params);

// 获取所有数据 不分状态
export const GetOrganizationAPI = ()=> request.get('/organization/getAll');

// 获取  已发布数据
export const GetOrganizationByStateAPI = ()=> request.get('/organization/getAllByState');

// 修改内容
export const PostOrganizationEditorContentAPI = (params)=> request.post('/organization/editorContent',params);

// 修改发布状态 传入 id  state
export const PostOrganizationEditorStateAPI = (params)=> request.post('/organization/editorState',params);

// 删除指定id的数据
export const PostOrganizationDelAPI = (params)=> request.post('/organization/del',params);
// --------组织机构 结束------------



// --------视频管理 开始------------

// 新增 Movies   movies
export const PostMoviesAddAPI = (params)=> request.post('/movies/add',params);

// 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostMoviesAddAllAPI = (params)=> request.post('/movies/addAll',params);

// 获取所有数据 不分状态
export const GetMoviesAPI = ()=> request.get('/movies/getAll');

// 获取 前端调用 按分类和发布状态。 前端只能获取发布状态为1 已发布的数据
export const PostMoviesByGroupNameStateAPI = (params)=> request.post('/movies/getByGroupNameState',params);

// 修改内容
export const PostMoviesEditorContentAPI = (params)=> request.post('/movies/editorContent',params);

// 修改发布状态 传入 id  state
export const PostMoviesEditorStateAPI = (params)=> request.post('/movies/editorState',params);

// 删除指定id的数据
export const PostMoviesDelAPI = (params)=> request.post('/movies/del',params);

// --------视频管理 结束------------



// --------建议意见管理 开始------------

// 新增 Propose propose  
export const PostProposeAddAPI = (params)=> request.post('/propose/add',params);

// 获取所有数据 不分状态
export const GetProposeAPI = ()=> request.get('/propose/getAll');
 
// 删除指定id的数据
export const PostProposeDelAPI = (params)=> request.post('/propose/del',params);

// --------建议意见管理 结束------------

// --------预约管理 开始------------

// 新增 Appointment appointment  
export const PostAppointmentAddAPI = (params)=> request.post('/appointment/add',params);

// 获取所有数据 不分状态
export const GetAppointmentAPI = ()=> request.get('/appointment/getAll');

export const PostAppointmentByPhoneAPI = (params)=> request.post('/appointment/getByPhone',params);
 
// 删除指定id的数据
export const PostAppointmentDelAPI = (params)=> request.post('/appointment/del',params);

// --------预约管理 结束------------

// --------用户管理 开始------------

// 新增 User   user
export const PostUserAddAPI = (params)=> request.post('/user/add',params);
//注册
export const PostUserRegisterAPI = (params)=> request.post('/user/register',params);
//手机号+短信验证注册
export const PostUserregisterPhoneAPI = (params)=> request.post('/user/registerPhone',params);

//修改手机号的旧手机验证码
export const PostUpdatePhoneAPI = (params)=> request.post('/user/updatePhone',params);

//登录
export const PostUserLoginAPI = (params)=> request.post('/user/login',params);

//手机号登录
export const PostUserLoginPhoneAPI = (params)=> request.post('/user/loginPhone',params);

// 新增,功能与上相同。编辑状态，把本地数据放入数据库中时调用
export const PostUserAddAllAPI = (params)=> request.post('/user/addAll',params);

// 获取所有数据 不分状态
export const GetUserAPI = ()=> request.get('/user/getAll');

//手机号查找用户信息
export const GetUserByPhonePI = (params)=> request.post('/user/getUserByPhone',params);

// 获取 前端调用 按分类和发布状态。 前端只能获取发布状态为1 已发布的数据
export const PostUserByGroupNameStateAPI = (params)=> request.post('/user/getByGroupNameState',params);

// 修改内容
export const PostUserEditorContentAPI = (params)=> request.post('/user/editorContent',params);

// 修改发布状态 传入 id  state
export const PostUserEditorStateAPI = (params)=> request.post('/user/editorState',params);

// 删除指定id的数据
export const PostUserDelAPI = (params)=> request.post('/user/del',params);

// --------用户管理 结束------------




//加载文本内容
export const LoadFile = (params)=> request.post('/loadPanelData',params);
//保存文本内容
export const SavePanelData = (params)=> request.post('/savePanelData',params);

//上传图片。返回新的图片名
export const SaveImgGetFileName = (params)=> request.post('/SaveImgGetFileName',params);

//上传文本，返回新的文本名
export const SaveTxtGetFileName = (params)=> request.post('/SaveTxtGetFileName',params);

//保存为本地数据
export const SaveAdminIndexAPI = (params)=> request.post('/SaveAdminIndex',params);


//阿里云短信服务。 发送短信验证
export const SendSmsCodeAPI = (params)=> request.post('/sendCode',params);


//阿里云 对象存储 0SS 服务。  
export const SaveFileOSSAPI = (params)=> request.post('/saveFileOSS',params);
//阿里云 对象存储 0SS 服务。 保存图片为上传时的名称
export const SaveFileByNameOSSAPI = (params)=> request.post('/saveFileByNameOSS',params);

//删除文件
export const DelFileAPI = (params)=> request.post('/DelFile',params);
//删除文件 OSS
export const DeleteFileOSS = (params)=> request.post('/deleteFileOSS',params);


//获取路径下的文件夹列表
export const GetPathFolders = (params)=> request.post('/GetPathFolders',params);

export const GetCurrentTime = ()=> request.get('/GetCurrentTime');

// this.dialogVisible = false; 
// this.form.state = 0; 
// this.contentItemData = editor.txt.html();
// this.form.articleContent = this.contentItemData ;
// const response = await this.$axios.post("/news/add", this.form);

// fromData.append("groupList", list);
// let config = {
//   headers: {
//     "Content-Type": "application/json", 
//   },
// };
// this.$axios.post("/news/getByGroupName",fromData,config).then((response) => {
//   console.log(response.data);
// });

