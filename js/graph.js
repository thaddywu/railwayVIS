function graph_layout_algorithm(){
    //geographical_position(); // TODO 现在这个函数是仅根据地理位置来计算，理想的布局算法由 @lzg 来完成一下
    set_pos();

    // console.log("pos = ", loc);
}

function project_to_screen(hh, ww) { // hh, ww为[0,1]之间的小数，这个函数将这个区间上的值映射到整个屏幕去掉margin的中间部分
    return [umargin+(dmargin-umargin)*hh, lmargin+(rmargin-lmargin)*ww];
}

function geographical_position(){
    //经度大概在90-130, 纬度在20-50
    for(let i = 0; i < tot_show_nodes; i++){
        loc[i] = project_to_screen((50 - real_position[i][1])/30, (real_position[i][0]-90)/40);
    }
}

let const_Vmain_scale = 1/1500;
let Vmain_scale = const_Vmain_scale;
function set_pos(){
    // 一共有tot_show_nodes个点需要计算位置，标号为0-tot_show_nodes-1，两两的距离存在了result里
    // 如果需要的话，可以使用real_position数组，里面按标号存了实际的经纬度
    // 最后把结果像上面函数一样存进loc里就行
    console.log("result = ", result);
    // console.log("result len = ", result.length);
    // console.log("point_num = ", tot_show_nodes);
    compute_position = mds.classic(result);
    // console.log(compute_position);
    let minh = 1e9, minw = 1e9;
    for(let i = 0; i < tot_show_nodes; i++){
        minh = Math.min(compute_position[i][1], minh);
        minw = Math.min(compute_position[i][0], minw);
    }
    for(let i = 0; i < tot_show_nodes; i++){
        loc[i] = project_to_screen((compute_position[i][1]-minh)/1500, (compute_position[i][0] - minw)/3000);
    }
}

// 下面开始是关于交互部分的位置计算与显示
function view_show(){
    if(tot_selected == 0){
        Recovery();
    }
    else if(tot_selected == 1){
        View1(select_id[0]);
    }
    else{
        View2(select_id[0], select_id[1]);
    }
}

let const_V1_scale = 1;
let V1_scale = const_V1_scale;
function View1(ID) {  // 第一视图:有一个点在中间
    console.log("Enter View 1! ID=",ID);
    loc[ID] = project_to_screen(0.5, 0.5);
    for(let i = 0; i < tot_show_nodes; i++){
        if(i == ID) continue;
        let real_dis = get_realdis(real_position[i], real_position[ID]);
        let now_dis = result[i][ID];
        loc[i][0] = loc[ID][0] + (real_position[ID][1] - real_position[i][1])*(now_dis/real_dis) * V1_scale;
        loc[i][1] = loc[ID][1] + (real_position[i][0] - real_position[ID][0])*(now_dis/real_dis) * V1_scale;
    }
    drawer()
}
function View2(ID1, ID2) {  // 第二视图:选了两个点
    console.log("Enter View 2! ID1=",ID1, ", ID2=", ID2);
}
function Recovery() {  // 恢复正常视图
    console.log("Recovery");
    graph_layout_algorithm();
    drawer();
}

function align_with_screen() {  // 将当前的图拉伸至屏幕刚好能装下
    function align_main() {

    }
    function align_1() {
        let ID = select_id[0];
        let maxw = 0, maxh = 0;
        for(let i = 0; i < tot_show_nodes; i++){
            if(i == ID) continue;
            maxh = Math.max(maxh, Math.abs(loc[i][0] - loc[ID][0]));
            maxw = Math.max(maxw, Math.abs(loc[i][1] - loc[ID][1]));
        }
        console.log(maxw, maxh);
        let tmp = Math.min((rmargin-lmargin)/2/maxw, (dmargin-umargin)/2/maxh);
        V1_scale *= tmp;
        View1(ID);
    }
    function align_2() {

    }

    if(tot_selected == 0) align_main();
    else if(tot_selected == 1) align_1();
}