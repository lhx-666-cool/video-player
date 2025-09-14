<template>
  <div class="box bg-black p-4 w-full h-[100vh] text-gray-300 overflow-y-auto">
    <div class="head font-extrabold text-4xl text-center pt-2">
      Video Player {{ url11 }}
    </div>
    <div class="inputs mt-4">
      <div class="row1 flex gap-2 items-center">
        <div class="label">
          Link1:
        </div>
        <input
          class="outline-none bg-neutral-700 flex-1 p-1 pl-2 pr-2 rounded-lg duration-100 ease-in border-1 border-neutral-700 focus:border-sky-600"
          type="text" v-model="link1" placeholder="Input link 1">
      </div>
      <div class="row1 flex gap-2 mt-2 items-center">
        <div class="label">
          Link2:
        </div>
        <input
          class="outline-none bg-neutral-700 flex-1 p-1 pl-2 pr-2 rounded-lg duration-100 ease-in border-1 border-neutral-700 focus:border-sky-600"
          type="text" v-model="link2" placeholder="Input link 2">
      </div>
      <div class="btns flex justify-center mt-4 gap-2 overflow-visible">
        <button ref="load" id="loadVideosBtn"
          class="bg-[#1668DC] p-1 pl-4 pr-4 rounded-md hover:bg-[#3C89E8] transition-all duration-100 ease-in-out"
          @click="handleLoad">
          Load
        </button>
        <div class="relative w-20">
          <div class="absolute z-100" @mouseenter="speedController = true" @mouseleave="speedController = false">
            <button ref="change" @click="handleChangeSpeed" id="changeVideoBtn"
              class="bg-[#1668DC] p-1 pl-4 pr-4 rounded-md w-20 hover:bg-[#3C89E8] transition-all duration-100 ease-in-out">
              Speed
            </button>
            <div class="list w-20 bg-[#1f1f1f] mt-1 rounded-md h-30 overflow-y-scroll" v-show="speedController">
              <div @click="handleChangeSpeed(i)" v-for="i in speedList" :key="i"
                class="p-1 text-sm text-center cursor hover:bg-[#313131] cursor-pointer">
                {{ i }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-1">
          <button class="bg-[#1668DC] p-1 rounded-md w-10 hover:bg-[#3C89E8] transition-all duration-100 ease-in-out" @click="delta -= 60">
            << 
          </button>
          <button class="bg-[#1668DC] p-1 rounded-md w-8 hover:bg-[#3C89E8] transition-all duration-100 ease-in-out" @click="delta -= 10">
            < 
          </button>
          <div class="border-1 border-[#424242] rounded-md leading-[32px] pl-4 pr-4 select-none">
            {{ delta }} s
          </div>
          <button class="bg-[#1668DC] p-1 rounded-md w-10 hover:bg-[#3C89E8] transition-all duration-100 ease-in-out" @click="delta += 10">
            >
          </button>
          <button class="bg-[#1668DC] p-1 rounded-md w-8 hover:bg-[#3C89E8] transition-all duration-100 ease-in-out" @click="delta += 60">
            >>
          </button>
        </div>
      </div>
    </div>
    <div class="resizable-container flex h-fit mt-4" ref="containerRef">
      <div class="pane left-pane h-fit" :style="{ width: leftPaneWidth + 'px' }">
        <video ref="v1" id="video1" class="w-full" controls @play="handleV1Play" @pause="handleV1Pause"
          @seeked="handelV1Seeked"></video>
      </div>
      <div class="resizer bg-red-400 w-2 h-20" @mousedown.prevent="startDrag" title="拖拽调整大小"></div>
      <div class="pane right-pane flex-1 h-fit">
        <video ref="v2" id="video2" class="w-full" controls muted @play="handleV2Play" @pause="handleV2Pause"
          @seeked="handleV2Seeked"></video>
      </div>
    </div>
  </div>
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';

const link1 = ref('');
const link2 = ref('');
const v1 = ref(null)
const v2 = ref(null)
const load = ref(null)
const change = ref(null)
const isSyncing = ref(false)
const speed = ref(1)

const route = useRoute()
const speedController = ref(false);

const speedList = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
const delta = ref(0)

onMounted(() => {
  if (route.query.url1 && route.query.url1 !== '') {
    link1.value = route.query.url1;
  }

  if (route.query.url2 && route.query.url2 !== '') {
    link2.value = route.query.url2;
    if (link1.value !== '') {
      handleLoad();
    }
  }
})


const handleChangeSpeed = (i) => {
  if (speed.value <= 0 || speed.value > 16) {
    alert("speed应该在0-16之间")
  }
  speed.value = i;
  v1.value.playbackRate = speed.value;
  v2.value.playbackRate = speed.value;
}

const handleLoad = () => {
  const url1 = link1.value;
  const url2 = link2.value;

  if (url1 && url2) {
    console.log(url1);
    v1.value.src = url1;
    v2.value.src = url2;
    v2.value.muted;
    console.log("视频已加载:", url1, url2);

    // 可以选择在加载后自动暂停或准备播放
    v1.value.pause();
    v2.value.pause();
    v1.value.currentTime = 0;
    v2.value.currentTime = 0;
    v1.value.play();
    v2.value.play();
  } else {
    alert("请输入两个有效的视频 URL！");
  }
}

const handleV1Play = () => {
  if (isSyncing.value) return; // 如果是程序触发的，则忽略
  isSyncing.value = true;
  console.log("Video 1 Play -> Syncing Video 2 Play");
  v2.value.play();
  isSyncing.value = false;
}

const handleV2Play = () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  console.log("Video 2 Play -> Syncing Video 1 Play");
  v1.value.play();
  isSyncing.value = false;
}

const handleV1Pause = () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  console.log("Video 1 Pause -> Syncing Video 2 Pause");
  v2.value.pause();
  // 短暂延迟重置标志位，以防快速点击导致不同步
  setTimeout(() => { isSyncing.value = false; }, 100);
}

const handleV2Pause = () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  console.log("Video 2 Pause -> Syncing Video 1 Pause");
  v1.value.pause();
  setTimeout(() => { isSyncing.value = false; }, 100);
}

const handelV1Seeked = () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  console.log(`Video 1 Seeked -> Syncing Video 2 to ${v1.value.currentTime}`);
  // 检查时间差，避免微小差异导致循环seek
  if (Math.abs(v1.value.currentTime + delta.value - v2.value.currentTime) > 0.1) {
    v2.value.currentTime = v1.value.currentTime + delta.value;
    v1.value.play();
    v2.value.play();
  }

  setTimeout(() => { isSyncing.value = false; }, 1000);
}

const handleV2Seeked = () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  console.log(`Video 2 Seeked -> Syncing Video 1 to ${v2.value.currentTime}`);
  if (Math.abs(v2.value.currentTime - v1.value.currentTime - delta.value) > 0.1) {
    v1.value.currentTime = v2.value.currentTime - delta.value;
    v1.value.play();
    v2.value.play();
  }
  setTimeout(() => { isSyncing.value = false; }, 1000);
}

watch(delta, () => {
  handelV1Seeked();
})

// --- State ---
const containerRef = ref(null); // 容器元素的引用
const leftPaneWidth = ref(200); // 左侧面板的初始宽度 (px)
const isDragging = ref(false);  // 是否正在拖拽
const startX = ref(0);          // 拖拽开始时的鼠标X坐标
const initialLeftWidth = ref(0); // 拖拽开始时左侧面板的宽度

// --- Props (可选，用于配置) ---
// 可以添加 props 来设置初始比例、最小/最大宽度等
// const props = defineProps({
//   initialRatio: { type: Number, default: 0.5 }, // 初始比例
//   minPaneWidth: { type: Number, default: 50 } // 最小面板宽度
// });

// --- Constants (可根据需要调整) ---
const MIN_PANE_WIDTH = 50; // 面板最小宽度 (px)
const RESIZER_WIDTH = 5;   // 拖拽条的宽度 (px) - 应与CSS中的宽度匹配

// --- Methods ---

onMounted(() => {
  leftPaneWidth.value = window.innerWidth / 2;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      v1.value.currentTime += 10;
      v2.value.currentTime += 10;
      handelV1Seeked();
    }else if (e.key === 'ArrowLeft') {
      v1.value.currentTime -= 10;
      v2.value.currentTime -= 10;
    }
  })
})

// 鼠标按下，开始拖拽
const startDrag = (event) => {
  console.log(11)
  isDragging.value = true;
  startX.value = event.clientX; // 记录起始鼠标位置
  initialLeftWidth.value = leftPaneWidth.value; // 记录起始左侧宽度

  // 添加全局事件监听器
  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('mouseleave', stopDrag); // 处理鼠标移出窗口的情况

  // 阻止默认文本选择行为
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize'; // 改变鼠标样式
};

// 鼠标移动，执行拖拽
const doDrag = (event) => {
  if (!isDragging.value || !containerRef.value) return;

  const currentX = event.clientX;
  const dx = currentX - startX.value; // 计算鼠标移动距离

  const containerWidth = containerRef.value.offsetWidth; // 获取容器总宽度
  let newLeftWidth = initialLeftWidth.value + dx; // 计算新的左侧宽度

  // --- 边界检查 ---
  // 保证左侧不小于最小宽度
  newLeftWidth = Math.max(MIN_PANE_WIDTH, newLeftWidth);
  // 保证右侧也不小于最小宽度 (容器总宽 - 新左侧宽度 - 拖拽条宽度 >= 最小宽度)
  newLeftWidth = Math.min(containerWidth - MIN_PANE_WIDTH - RESIZER_WIDTH, newLeftWidth);

  leftPaneWidth.value = newLeftWidth; // 更新左侧宽度
};

// 鼠标松开，结束拖拽
const stopDrag = () => {
  if (isDragging.value) {
    isDragging.value = false;

    // 移除全局事件监听器
    document.removeEventListener('mousemove', doDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('mouseleave', stopDrag);

    // 恢复默认行为
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }
};

// --- Lifecycle Hooks ---

// 如果初始宽度想基于比例计算，可以在 onMounted 中进行
// onMounted(() => {
//   if (containerRef.value) {
//     leftPaneWidth.value = containerRef.value.offsetWidth * props.initialRatio;
//   }
// });

// 组件卸载前清理事件监听器，防止内存泄漏
onBeforeUnmount(() => {
  stopDrag(); // 确保拖拽状态被重置，监听器被移除
  document.removeEventListener('keydown')
});

</script>