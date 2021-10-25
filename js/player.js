
// 재생리스트 정보
var player_info = [
  {
    title: "Electronic",
    img: "",
    list: [{
      id: "5qqlqhMNG8s",
      title: "Rock with you",
      name: "SEVENTEEN"
    },{
      id: "7_CIOWNR3j8",
      title: "you were my star",
      name: "몽니"
    },{
      id: "v6rL456ikAA",
      title: "Taylor",
      name: "임수연"
    },{
      id: "Aw-PN5_2JyE",
      title: "제목04",
      name: "가수04"
    },{
      id: "lRZWGndSPeQ",
      title: "제목05",
      name: "가수05"
    },{
      id: "przR0GQBJyo",
      title: "제목06",
      name: "가수06"
    },{
      id: "przR0GQBJyo",
      title: "제목07",
      name: "가수07"
    },{
      id: "przR0GQBJyo",
      title: "제목08",
      name: "가수08"
    },{
      id: "przR0GQBJyo",
      title: "제목09",
      name: "가수09"
    }]
  },{
    title: "발라드",
    img: "",
    list: [{
      id: "8do-DV3G7Zs",
      title: "제목11",
      name: "가수11"
    },{
      id: "JSvTuFu3N20",
      title: "제목12",
      name: "가수12"
    },{
      id: "Aw-PN5_2JyE",
      title: "제목13",
      name: "가수13"
    },{
      id: "lRZWGndSPeQ",
      title: "제목14",
      name: "가수14"
    },{
      id: "przR0GQBJyo",
      title: "제목15",
      name: "가수15"
    }]
  },{
    title: "R&B",
    img: "",
    list: [{
      id: "JSvTuFu3N20",
      title: "제목21",
      name: "가수21"
    },{
      id: "Aw-PN5_2JyE",
      title: "제목22",
      name: "가수22"
    },{
      id: "lRZWGndSPeQ",
      title: "제목23",
      name: "가수23"
    },{
      id: "przR0GQBJyo",
      title: "제목24",
      name: "가수24"
    }]
  },{
    title: "POP",
    img: "",
    list: [{
      id: "Aw-PN5_2JyE",
      title: "제목31",
      name: "가수31"
    },{
      id: "lRZWGndSPeQ",
      title: "제목32",
      name: "가수32"
    },{
      id: "przR0GQBJyo",
      title: "제목33",
      name: "가수33"
    }]
  }
];


// 빈 값 체크
var isEmpty = function(value){
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){ 
    return true 
  }else{ 
    return false 
  } 
};

var index = 0;
var option;
var onLoad;
var yPlayer;
var btn_play = false;

//재생바타이머 관련
var isPause = false;
var audioTimer;
var progress_val = 0;	// 재생 progress bar 값
var playtime = 0;		// 재생 시간


var play_list = player_info[0].list;

function loadYouTubeApi(grouplist) {

  // 재생 리스트에 선택한 그룹의 리스트 담기
  for(var j = 0; j < player_info.length; j++){
    if(grouplist === j){
      play_list = player_info[j].list;
    }
  }

  // 재생 리스트 뿌려주기
  function playerList() {
    var html = '';
    for(var i = 0; i < play_list.length; i++){
      html += '<li class="list' + i + '">';
      html += '<div class="img_box"><img src="https://img.youtube.com/vi/' + play_list[i].id + '/0.jpg"></div>';
      html += '<div class="info_box">';
      html += '<p class="title">' + play_list[i].title + '</p>';
      html += '<p class="name">' + play_list[i].name + '</p>';
      html += '</div>';
      html += '<a href="#" onClick="listPlayer(' + i  + ');">재생</a></li>';
    }
    return html;
  }
  $('.player_list .list_box ul').html(playerList());


  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  videoID = play_list[index].id;
}

function onYouTubeIframeAPIReady() {
  yPlayer = new YT.Player('player', {
    width: '100%',
    videoId: videoID,
    playerVars : { 
      'rel': 0,             		            // 추천영상 노출 업데이트 이후로 작동안함
      'autoplay': 0,                        // 자동재생
      'cc_load_policy' : 0,                 // 자막 0 : on, 1 : off
      'controls': 0,                       // 동영상 플레이어 컨트롤 표기
      'disablekb' : 0,                       // 키보드 컨트롤 사용 중지
      'modestbranding' : 0,                 // 동영상 로고표시 유무 업데이트 이후로 작동안함
      'showinfo' : 1                        // 재생영상에 대한 정보 유무
    }, 
    events: {
      'onReady': onPlayerReady,             //로딩중에 이벤트 실행
      'onStateChange': onPlayerStateChange ,//플레이어 상태 변화 시 이벤트를 실행
      'onError': onPlayerError              //플레이어 오류 발생시 실행
    }
  });
}

//플레이어 오류 발생시 실행
function onPlayerError(event) {
  console.log('Error');
  if ( event.data == 150 ){
    yPlayer.stopVideo();
    onPlayerStateChange_excute();
  }
}

//로딩중에 이벤트 실행
function onPlayerReady(event) {
  var sound_value = $(".sound_control").val();
  yPlayer.setPlaybackRate(1);
  event.target.setVolume(sound_value);
  yPlayer.playVideo();
  $('.player_title').html(play_list[index].title);
  $('.player_name').html(play_list[index].name);

  maxTime = Math.floor(event.target.getDuration());
  var duration = setTimeFormat(maxTime);
  $(".play-time .end").text(duration);
  $(".time_control").prop("max", maxTime);
  play_on("false");
  timeControls(0);

} 

//플레이어 상태 변화 시 이벤트를 실행 
// -1 –시작되지 않음
//  0 – 종료        YT.PlayerState.ENDED
//  1 – 재생 중     YT.PlayerState.PLAYING
//  2 – 일시중지    YT.PlayerState.PAUSED
//  3 – 버퍼링      YT.PlayerState.BUFFERING
//  5 – 동영상 신호  YT.PlayerState.CUED
function onPlayerStateChange(event) {
  stopAudioTimer(); // 타이머 중지
  if (event.data == YT.PlayerState.PLAYING) {
    // 재생중
    play_on("true");
    startAudioTimer(); // 오디오 재생시 타이머 시작, 재생바 진행, 재생시간 시작
  }else if(event.data == YT.PlayerState.PAUSED) {
    // 일시정지
    play_on("false");
    stopAudioTimer(); // 타이머 중지
  }else if (event.data == YT.PlayerState.ENDED) {
    // 종료
    play_on("false");
    setTimeout(onPlayerStateChange_excute, onLoad); // 재생 완료후 
    $(".play-time .start").text('00:00');	// 타이머 중지
    $(".play-time .end").text('00:00');
    $(".play-progress-bar").width(0);	// 재생바 초기화
    $(".time_control").prop("value", 0);

  }else if (event.data == YT.PlayerState.BUFFERING) {

  }else if (event.data == YT.PlayerState.CUED) {
    play_on("false");
    stopAudioTimer(); // 타이머 중지
  }

}


/* 오디오 재생시 인터벌 시작
: 재생 로딩바 시작
: 재생시간 포멧 변경 시작 */
function startAudioTimer(){
  isPause = false;
  audioTimer = setInterval(function(){
    varTimerMove();
  }, 1000);
}

function varTimerMove(){ 
  if(!isPause){
    // youtube 링크 삽입일 경우
    // 해당 동영상의 정보중 현재 재생시간을 가져온다.
    var currentTime = Math.floor(yPlayer.getCurrentTime());

    // 00:00의 형식으로 표기하기위해 포맷변경
    playtime = setTimeFormat(Math.floor(yPlayer.getCurrentTime()));
    
    // 가져온 현재 재생시간을 progress bar에 표기하기위해 currentTime가공
    // 재생 완료를 100으로 잡고 현재 재생시간을 계산
    // 소수점 첫번째 자리까지 계산
    progress_val = (currentTime/maxTime)*100;
    progress_val = progress_val.toFixed(1);
    $(".play-time .start").text(playtime);
    $(".play-progress-bar").css('width', progress_val+"%");
    //재생바현재위치 표시]
    $(".time_control").prop("value", currentTime);
  }
}

//타이머 중지
function stopAudioTimer(){ 
  clearInterval(audioTimer); 
  isPause = true;
}

// 재생시간 포멧변경
function setTimeFormat(sec_time){
  var sec_num = parseInt(sec_time);
  var minutes = Math.floor(sec_num / 60);
  var seconds = sec_num - (minutes * 60);

  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  
  return minutes + ':' + seconds;
}

// 재생위치 클릭시 이동
function timeControls(time){
  var time_var = (time/maxTime)*100;
  yPlayer.seekTo(time);
  $(".time_control").prop("value", time);
  $(".play-time .start").text(setTimeFormat(time));
  $(".play-progress-bar").css('width', time_var+"%");
}

// 재생시간 완료후 다음곡으로 넘어갈때 실행
function onPlayerStateChange_excute(){
  nextVideo();
}

// 첫 실행시 실행
function execute_func(){
  if ( isEmpty(play_list[0]) == false ){
    if ( isEmpty(yPlayer) == false ){
      yPlayer.stopVideo();
      yPlayer.destroy();
      yPlayer = null;     
      index = 0;
      onYouTubeIframeAPIReady();
    }
    loadYouTubeApi();
    page_on(index);
    play_on("true");
  }
}

// 재생함수
function playload(grouplist) {
  yPlayer.stopVideo();
  yPlayer.destroy();
  yPlayer = null;
  videoID = play_list[index].id;
  loadYouTubeApi(grouplist);
  onYouTubeIframeAPIReady();
  page_on(index);
  play_on("true");
}

// 재생
function playVideo() {
  if(option == "Sequen"){
    yPlayer.playVideo();
  }else{
    option = "Sequen";
    execute_func(); 
  }
}

//랜덤재생
function randomVideo() {
  if(option == "Sequen"){
    option = "Random";
    $('.controls .btn_random').addClass('on');
  }else{
    option = "Sequen";
    $('.controls .btn_random').removeClass('on');
  }
}

// 일시정지
function pauseVideo() {
  yPlayer.pauseVideo();
}

// 종료
function stopVideo() {
  yPlayer.stopVideo();
}

// 다음재생
function nextVideo() {
  if ( isEmpty(yPlayer) == false ){
    if (option == "Sequen" ){
      if ( index < play_list.length - 1){
        index++;
        playload();
      }else{ 
        alert("다음 곡이 없습니다."); 
      }
    }else{ 
      index = Math.floor(Math.random() * play_list.length);  
      playload();
    }
  }
}

// 이전재생
function prevVideo() {
  if ( isEmpty(yPlayer) == false ){
    if (option == "Sequen" ){
      if ( index > 0){
        index--;
        playload();
      }else{ 
        alert("이전 곡이 없습니다."); 
      }

    }else{ 
      index = Math.floor(Math.random() * play_list.length);  
      playload();
    }
  }
}

// 음소거 On / Off
function volumeMute() {
  // 음소거
  if(yPlayer.isMuted() == true) {
    yPlayer.unMute();
    jQuery("#volumeMute").val("음소거");
  }
  // 음소거 해제
  else if(yPlayer.isMuted() == false) {
    yPlayer.mute();
    jQuery("#volumeMute").val("음소거 해제");
  }
}

// 볼륨 조절
function soundControl(number) {
  yPlayer.setVolume(number);
}

//리스트 선택시 실행
function listPlayer(list_id){
  if ( isEmpty(yPlayer) == false ){
    index = list_id;
    playload();
  }
}

//그룹 선택시 실행
function group(grouplist){
if ( isEmpty(yPlayer) == false ){
    index = 0;
    playload(grouplist);    
  }
}

//실행중인 리스트 온
function page_on(on){
  for(var i = 0; i < play_list.length; i++){
    if(i === on){
      $('.player_list ul li.list'+i).addClass('on');
    }else{
      $('.player_list ul li.list'+i).removeClass('on');
    }
  }
}

//재생버튼 클릭시 실행
function play_on(on){
  if(on === "false"){
    $(".btn_play").attr("value", "재생");
    $(".btn_play").attr("onClick", "playVideo();");
  }else{
    $(".btn_play").attr("value", "정지");
    $(".btn_play").attr("onClick", "pauseVideo();");
  }
}

//그룹 목록 뿌려주기
function groupList() {
  var html = '';
  html += '<div class="swiper-wrapper">'
  for(var i = 0; i < player_info.length; i++){
    html += '<div class="swiper-slide genre_group list' + i + '">';
    html += '<div class="thumb_box"><img src="https://img.youtube.com/vi/' + player_info[i].list[0].id + '/maxresdefault.jpg" width="100%"><button class="btn_genre_group" onClick="group(' + i + ');">재생</button></div>'
    html += '<h3>' + player_info[i].title + '</h3>';
    html += '<ul>';
    for(var j = 1; j < player_info[i].list.length; j++){
      if(j < 8){
        html += '<li><img src="https://img.youtube.com/vi/' + player_info[i].list[j].id + '/0.jpg" width="100%"></li>';
      }
    }
    html += '</ul>';
    html += '</div>';
  }
  html += '</div>';
  html += '<div class="swiper-pagination"></div>';
  return html;
}



//접속시 실행
$(window).on('load', function() {
  // playVideo();
  $('.player_genre .genre_wrap').html(groupList());

  // 인트로
  setTimeout(function() {
    $('.intro').css('display', 'none');
  }, 3500);  

  // 장르 선택 버튼
  $('.btn_genre_group').click(function(){
    $('.player_genre').css('display', 'none');
    $('.player_total').css('display', 'block');

    playVideo();
  });
  
  // Top Menu
  $('.menu_player_genre').click(function() {
    $('.player_list').hide();
    $('.player_total').hide();

    $('.player_genre').show();
  });

  $('.menu_player_total').click(function() {
    $('.player_list').hide();
    $('.player_genre').hide();

    $('.player_total').show();
  });

  $('.menu_player_list').click(function() {
    $('.player_genre').hide();

    $('.player_total').show();
    $('.player_list').show();
  });

  var swiper = new Swiper('.genre_wrap', {
    direction: 'vertical',
    mousewheel: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});
