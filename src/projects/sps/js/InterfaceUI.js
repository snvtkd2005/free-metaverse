// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用 
class Interface_UI{
    constructor(_this){
        // 获取三维热点id
        this.showLayer = (e, data) => {
            console.log(e,data);
            if (data.id == 'hotpoint009') {
                _this.$refs.work.isShowDialog = true
            }
            if (data.id == 'hotpoint003') {
                _this.$refs.recruit.isShowDialog = true
            }
            if (data.id == 'hotpoint005') {
                _this.$refs.company.isShowDialog = true
            }
            if (data.id == 'hotpoint006') {
                _this.$refs.business.isShowDialog = true
            }
            if (data.id == 'hotpoint007') {
                _this.$refs.blog.isShowDialog = true
            }
        };
        this.SetTriggerOverlap = (data) => {
            console.log(data);
            let pos = data.id.split('_')[1]
            if (data.id.includes('jump')) {
                _this.$refs.elevator.isShowDialog = data.state
            }
            
            if (pos == ("upCar")) {
                _this.$refs.riding.isShowDialog =data.state;
            }
            if (pos == "upCar2") {
                _this.$refs.ridingSec.isShowDialog =data.state;
            }
            if (data.state) {

                if (pos == ("upCar")) {
                    _this.$refs.riding.isShowDialog = true
                }
                if (pos == "upCar2") {
                    _this.$refs.ridingSec.isShowDialog = true
                }
                // if (data.id == 'hotpoint009') {
                //     _this.$refs.work.isShowDialog = true
                // }
                // if (data.id == 'hotpoint003') {
                //     _this.$refs.recruit.isShowDialog = true
                // }
                // if (data.id == 'hotpoint005') {
                //     _this.$refs.company.isShowDialog = true
                // }
                // if (data.id == 'hotpoint006') {
                //     _this.$refs.business.isShowDialog = true
                // }
                // if (data.id == 'hotpoint007') {
                //     _this.$refs.blog.isShowDialog = true
                // }

            } 
        }
        _Global.showLayer = this.showLayer;
        _Global.SetTriggerOverlap = this.SetTriggerOverlap;
    }
}
export { Interface_UI };