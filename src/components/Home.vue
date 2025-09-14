<template>
  <div class="w-full flex justify-center h-[100vh] bg-zinc-900 overflow-auto">
    <div class="max-w-200 w-full p-2 text-white mt-2">
      <div class="title text-center text-4xl font-extrabold">
        WebDav
      </div>
      <div class="list w-full bg-zinc-800 mt-4 rounded-xl p-4">
        <div class="item mt-2" v-for="item in data" :key="item.href">
          <div @click="handleJump(item.href, item.isDirectory)" :title="item.displayName"
            class="content flex gap-2 hover:bg-zinc-700 p-2 rounded-xl duration-200 ease-in-out hover:scale-102 hover:shadow-black hover:shadow-xs">
            <div class="icon shrink-0">
              <img :src="folder" v-show="item.isDirectory" />
              <img :src="fileSvg" v-show="!item.isDirectory" />
            </div>
            <div class="name whitespace-nowrap overflow-hidden text-ellipsis">
              {{ item.displayName }}
            </div>
            <div class="hidden">
              {{ item.href }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Dav from '../js/dav';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import folder from '../assets/folder.svg'
import fileSvg from '../assets/fileSvg.svg'
const data = ref([])
const router = useRoute()
const routerr = useRouter();
const path = import.meta.env.VITE_ROOT_PATH + (router.params.pathMatch.length > 0 ? router.params.pathMatch.join('/') : '');

async function getWebDAVFileList(webdavUrl, username, password, directoryPath) {
  const dav = new Dav(webdavUrl, username, password);

  try {
    const directoryContents = await dav.getDirectoryContents(directoryPath);
    console.log(directoryContents)
    data.value = directoryContents;
    data.value.shift();
    console.log(data.value)
    console.log(router.params.pathMatch)
    let paths = router.params.pathMatch;
    if (paths[paths.length - 1] == '') {
      paths.pop();
    }
    data.value.unshift({
      displayName: '..',
      isDirectory: true,
      href: (paths.length > 1 ? paths.join('/') : '')
    })
    console.log(data.value)

  } catch (error) {
    console.error("WebDAV操作失败:", error);
  }
}

getWebDAVFileList(`${import.meta.env.VITE_ALIST_URL}dav`, import.meta.env.VITE_USERNAME, import.meta.env.VITE_PASSWORD, path)

const handleJump = (href, isDirectory) => {
  if (isDirectory) {
    href = href.replace(`/dav${import.meta.env.VITE_ROOT_PATH}`, '')
    routerr.push('/file/' + href);
  } else {
    routerr.push(`/video?url1=${import.meta.env.VITE_ALIST_URL.slice(0, -1)}` + href.replace('pptVideo', 'teacherTrack') + `&url2=${import.meta.env.VITE_ALIST_URL.slice(0, -1)}a` + href.replace('teacherTrack', 'pptVideo'))
  }

}
</script>