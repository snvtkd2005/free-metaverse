

<template>
  <div class="w-full gap-y-0.5 flex flex-col">
    <div
      v-for="(item, i) in setting"
      :key="i"
      class="text-xs mx-auto text-left flex w-full px-1 mb-1 justify-between"
    >
      <div v-if="item.display" class="self-center w-2/3 truncate ">
        {{ item.title }}
      </div>
      <div v-if="item.display" class="self-center">
        <div v-if="item.type == 'color'" class="flex gap-2">
          <YJinput_color
            :index="i"
            :value="item.value"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'toggle'" class="w-4 h-4">
          <YJinput_toggle
            class="w-4 h-4"
            :index="i"
            :value="item.value"
            :callback="item.callback"
          ></YJinput_toggle>
        </div>

        <div
          v-if="item.type == 'file' && item.filetype == 'hdr'"
          class="flex gap-2"
        >
          <div
            @click="SelectItem('选择HDR', item, i)"
            class="w-10 h-10 bg-black cursor-pointer"
          >
            <img
              v-if="item.value"
              class="w-full h-full"
              :src="$uploadHDRUrl + item.value.replace('.hdr', '.jpg')"
            />
          </div>
          <div
            class="w-auto h-6 rounded-sm bg-gray-50 flex cursor-pointer"
            @click="SelectItem('选择HDR', item, i)"
          >
            <div
              class="text-xs pl-1 self-center mx-auto w-10 h-4 leading-4 rounded-sm text-black"
            >
              浏览...
            </div>
          </div>
        </div>

        <div
          v-if="item.type == 'file' && item.filetype == 'image'"
          class="flex gap-2"
        >
          <div
            @click="SelectItem('选择通用图片', item, i)"
            class="w-10 h-10 cursor-pointer"
          >
            <img
              v-if="item.value"
              class="w-full h-full"
              :src="$uploadUVAnimUrl + item.value"
            />
          </div>
          <div
            class="w-auto h-6 rounded-sm bg-gray-50 flex cursor-pointer"
            @click="SelectItem('选择通用图片', item, i)"
          >
            <div
              class="text-xs pl-1 self-center mx-auto w-10 h-4 leading-4 rounded-sm text-black"
            >
              浏览...
            </div>
          </div>
        </div>

        <div
          v-if="item.type == 'file' && item.filetype == 'audio'"
          class="flex gap-2"
        >
          <div class="w-32 h-6 cursor-pointer">
            <audio
              v-if="item.value"
              class="w-full h-full"
              controls
              :src="$uploadAudioUrl + item.value"
            ></audio>
          </div>
          <div class="w-20 h-6 rounded-sm flex">
            <div
              class="text-xs pl-1 self-center w-10 h-full leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('选择音效', item, i)"
            >
              浏览...
            </div>
            <div
              v-if="item.value"
              class="text-xs ml-2 self-center w-auto h-full leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('移除音效', item, i)"
            >
              移除
            </div>
          </div>
        </div>

        <div
          v-if="item.type == 'file' && item.filetype == 'particle'"
          class="flex gap-2"
        >
          <div
            @click="SelectItem('选择特效', item, i)"
            class="w-10 h-10 cursor-pointer"
          >
            <img
              v-if="item.value"
              class="w-full h-full"
              :src="$uploadGroupUrl + item.value + '/thumb.jpg'"
            />
          </div>
          <div class="w-auto h-6 rounded-sm flex">
            <div
              class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('选择特效', item, i)"
            >
              浏览...
            </div>

            <div
              v-if="item.value"
              class="text-xs ml-2 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('移除特效', item, i)"
            >
              移除
            </div>
          </div>
        </div>

        <div
          v-if="item.type == 'file' && item.filetype == 'weapon'"
          class="flex gap-2"
        >
          <div
            @click="SelectItem('选择武器', item, i)"
            class="w-10 h-10 cursor-pointer"
          >
            <img
              v-if="item.value"
              class="w-full h-full"
              :src="$uploadUrl + item.value"
            />
          </div>
          <div class="w-auto h-6 rounded-sm flex">
            <div
              class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('选择武器', item, i)"
            >
              浏览...
            </div>

            <div
              v-if="item.value"
              class="text-xs ml-2 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('移除武器', item, i)"
            >
              移除
            </div>
          </div>
        </div>

        <!-- 选择模型 -->
        <div
          v-if="item.type == 'file' && item.filetype =='静态模型'"
          class="flex gap-2"
        >
          <div
            @click="SelectItem(item.filetype, item, i)"
            class="w-10 h-10 cursor-pointer"
          >
            <img
              v-if="item.value"
              class="w-full h-full"
              :src="$uploadUrl + item.value+ '/thumb.png'"
            />
          </div>
          <div class="w-auto h-6 rounded-sm flex">
            <div
              class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem(item.filetype, item, i)"
            >
              浏览...
            </div>

            <div
              v-if="item.value"
              class="text-xs ml-2 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('移除武器', item, i)"
            >
              移除
            </div>
          </div>
        </div>


        <div
          v-if="item.type == 'file' && item.filetype == 'equip'"
          class="flex gap-2"
        > 
          <div class="w-auto h-6 rounded-sm flex">
            <div
              class="text-xs pl-1 self-center mx-auto w-auto h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('选择装备', item, i)"
            >
              添加装备...
            </div> 
          </div>
        </div>

        <div
          v-if="item.type == 'file' && item.filetype == 'avatar'"
          class="flex gap-2"
        >
          <div
            @click="SelectItem('选择avatar', item, i)"
            class="w-10 h-10 cursor-pointer"
          >
            <img
              v-if="item.value"
              class="w-full h-full"
              :src="$uploadUrl + item.value"
            />
          </div>
          <div class="w-auto h-6 rounded-sm flex">
            <div
              class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
              @click="SelectItem('选择avatar', item, i)"
            >
              浏览...
            </div>
          </div>
        </div>


        <div v-if="item.type == 'intArrayVariable'" class=" gap-2 text-black">
          <div
            v-for="(item2, j) in item.value"
            :key="j"
            class="self-center w-auto h-auto relative gap-x-3 flex "
          >
            <div class=" w-20 ">等级{{j+1}}:</div>

            <YJinput_number
              :value="item2"
              type="int"
              :step="item.step"
              :index="j"
              :callback="(j,e)=>{item.value[j]=e;item.callback(i,item.value);}"
            />
            <div class=" border w-8 cursor-pointer text-center " @click="item.value.push(item2)">+</div>
            <div class=" border w-8 cursor-pointer text-center " @click="item.value.splice(j,1)">-</div>
          </div>

        </div>

        <div v-if="item.type == 'dropArrayVariable'" class=" gap-2 text-black">
          <div
            v-for="(item2, j) in item.value"
            :key="j"
            class="self-center w-auto h-auto relative gap-x-3 flex "
          > 
            <YJinput_drop
              class="w-full h-full"
              :value="item2.property"
              :options="item.options"
              :index="j"
              :callback="(j,e)=>{item.value[j].property=e;item.callback(i,item.value);}"
            />
            <YJinput_number
              :value="item2.value"
              type="int"
              :step="item.step"
              :index="j"
              :callback="(j,e)=>{item.value[j].value=e;item.callback(i,item.value);}"
            />
            <div class=" border text-white w-8 h-full self-center cursor-pointer text-center " @click="item.value.push({property:item2.property,value:item2.value})">+</div>
            <div class=" border text-white w-8 h-full self-center cursor-pointer text-center " @click="item.value.splice(j,1)">-</div>
          </div> 
        </div>

        <!-- 任务目标 -->
        <div v-if="item.type == 'taskArrayVariable'" class=" gap-2 text-black">
          <div
            v-for="(item2, j) in item.value"
            :key="j"
            class="self-center w-auto h-auto relative gap-x-3 flex "
          > 
            <YJinput_drop
              class="w-full h-full"
              :value="item2.type"
              :options="item.options"
              :index="j"
              :callback="(j,e)=>{item.value[j].type=e;item.callback(i,item.value);}"
            />
              <YJinput_text
              class="w-20 h-4"
              :value="item2.name"
              :index="j"
              :callback="(j,e)=>{item.value[j].name=e;item.callback(i,item.value);}"
            />
            <div class=" w-32">
              <YJinput_number
                :value="item2.need"
                type="int"
                :step="item.step"
                :index="j"
                :callback="(j,e)=>{item.value[j].need=e;item.callback(i,item.value);}"
              />
            </div>
            <div class=" border text-black w-8 h-full self-center cursor-pointer text-center " @click="item.value.push({type:item2.type,need:item2.need})">+</div>
            <div class=" border text-black w-8 h-full self-center cursor-pointer text-center " @click="item.value.splice(j,1)">-</div>
          </div> 
        </div>
        
        <!-- 道具奖励 -->
        <div v-if="item.type == 'rewardArrayVariable'" class=" gap-2 text-black">
          <div
            v-for="(item2, j) in item.value"
            :key="j"
            class="self-center w-auto h-auto relative gap-x-3 flex "
          > 
            <YJinput_drop
              class="w-full h-full"
              :value="item2.type"
              :options="item.options"
              :index="j"
              :callback="(j,e)=>{item.value[j].type=e;item.callback(i,item.value);}"
            />
            
            <div class="w-auto h-6 rounded-sm flex">
              <div
                class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
                @click="SelectItem2('选择装备或道具',item2.type,j)"
              >
                浏览...
              </div>
            </div>
            <div v-if="item2.skill"
                  class="w-full h-full relative flex">
              <div>
                    <img
                      v-if="item2.skill.icon"
                      class="w-9 h-9 rounded-md"
                      :src="
                        item2.skill.icon.includes('http') ||
                        item2.skill.icon.includes('./public')
                          ? item2.skill.icon
                          : this.$uploadUVAnimUrl + item2.skill.icon
                      "
                      alt=""
                    />
                  </div>

                  <div
                    class="h-9 w-24 text-sm border text-left flex rounded-md p-1 leading-3 overflow-hidden"
                  >
                    <div class="self-center">
                      {{ item2.skill.name }}
                    </div>
                  </div>
            </div> 
            <div v-if="item2.type=='prop'" class=" w-32">
              <YJinput_number
                :value="item2.count"
                type="int"
                :step="item.step"
                :index="j"
                :callback="(j,e)=>{item.value[j].count=e;item.callback(i,item.value);}"
              />
            </div>
            <div class=" border text-black w-8 h-full self-center cursor-pointer text-center " @click="item.value.push({type:item2.type,need:item2.need})">+</div>
            <div class=" border text-black w-8 h-full self-center cursor-pointer text-center " @click="item.value.splice(j,1)">-</div>
          </div> 
        </div>

        <!-- 任务发布 -->
        <div v-if="item.type == 'taskList'" class=" relative gap-2 pt-8 text-white">
          <div class=" absolute right-0 top-0 border text-white w-4 h-4 self-center cursor-pointer text-center " @click="item.value.push({id:'',from:'',taskTitle:''})">+</div>
          <div
            v-for="(item2, j) in item.value"
            :key="j"
            class="self-center w-auto h-auto relative gap-x-1 flex "
          > 
            <div class=" w-20">{{item2.taskTitle}}</div>
            
            <div class="w-auto h-6 rounded-sm flex">
              <div
                class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
                @click="SelectItem2('选择任务',item2.type,j)"
              >
                浏览...
              </div>
            </div>
            <div class=" border text-white w-4 h-4 self-center cursor-pointer text-center " @click="item.value.push({id:item2.id,from:item2.from,taskTitle:item2.taskTitle})">+</div>
            <div class=" border text-white w-4 h-4 self-center cursor-pointer text-center " @click="item.value.splice(j,1)">-</div>
          </div> 
        </div>

        <!-- 商品列表 -->
        <div v-if="item.type == 'goodsList'" class=" relative gap-2 pt-8 text-white">
          <div class=" absolute right-0 top-0 border text-white w-4 h-4 self-center cursor-pointer text-center " @click="item.value.push({id:'',from:'',taskTitle:''})">+</div>
          <div
            v-for="(item2, j) in item.value"
            :key="j"
            class="self-center w-auto mb-px h-auto relative gap-x-1 flex "
          > 
            <div class=" w-20">{{item2.name}}</div>
            
            <div class="w-auto h-6 rounded-sm flex">
              <div
                class="text-xs pl-1 self-center mx-auto w-10 h-6 leading-6 bg-gray-50 rounded-sm text-black cursor-pointer"
                @click="SelectItem2('选择商品',item2.type,j)"
              >
                浏览...
              </div>
            </div>
            <div class=" border text-white w-4 h-4 self-center cursor-pointer text-center " @click="item.value.push({id:item2.id,from:item2.from,taskTitle:item2.taskTitle})">+</div>
            <div class=" border text-white w-4 h-4 self-center cursor-pointer text-center " @click="item.value.splice(j,1)">-</div>
          </div> 
        </div>

        <div v-if="item.type == 'int'" class="flex gap-2 text-black">
          <YJinput_number
            :value="item.value"
            :type="item.type"
            :step="item.step"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'num'" class="flex gap-2 text-black">
          <YJinput_number
            :value="item.value"
            :step="item.step"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'slider'" class="flex gap-2">
          <YJinput_range
            :index="i"
            :value="item.value"
            :step="item.step"
            :min="item.min"
            :max="item.max"
            :callback="item.callback"
          />
          <div>{{ item.value }}</div>
        </div>

        <div v-if="item.type == 'vector3'" class="w-auto h-6 text-black">
          <YJinput_vector3
            class="w-auto h-6"
            :value="item.value"
            :step="item.step"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'vector2'" class="w-auto h-6 text-black">
          <YJinput_vector2
            class="w-auto h-6"
            :value="item.value"
            :step="item.step"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'vector2xy'" class="w-auto h-6 text-black">
          <YJinput_vector2xy
            class="w-auto h-6"
            :value="item.value"
            :step="item.step"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'vector3xyz'" class="w-auto h-6 text-black">
          <YJinput_vector3xyz
            class="w-auto h-6"
            :value="item.value"
            :step="item.step"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'drop'" class="w-full h-10 text-black">
          <YJinput_drop
            class="w-full h-full"
            :value="item.value"
            :options="item.options"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'text'" class="w-20 h-4 text-black">
          <YJinput_text
            class="w-20 h-4"
            :value="item.value"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div v-if="item.type == 'textarea'" class="w-32 h-auto text-black">
          <YJinput_textarea
            class="w-full h-20"
            :value="item.value"
            :index="i"
            :callback="item.callback"
          />
        </div>

        <div
          v-if="item.type == 'upload'"
          class="relative flex gap-2 cursor-pointer"
        >
          <div>{{ item.value }}</div>
          <el-upload
            class="bg-transparent"
            action=""
            :before-upload="item.handleBeforeUpload"
            :accept="item.accept"
            :show-file-list="false"
          >
            <div class="p-2 w-20 cursor-pointer bg-gray-500 hover:bg-546770">
              上传
            </div>
          </el-upload>
        </div>

        <!-- 装备 -->
        <div class="mt-2 flex" v-if="item.type == 'equipList'">
          <div
            v-for="(equip, j) in item.value"
            :key="j"
            class="self-center w-20 h-auto relative"
          >
            <div
              class="w-10 h-10 self-center mx-auto mt-2 cursor-pointer"
              @click="ClickItem('移除装备', j)"
            >
              <img
                class="w-full h-full object-fill hover:opacity-70"
                :src="$uploadUrl + equip.icon"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="item.display && item.unit"
        class="self-center ml-2 w-4 truncate"
      >
        {{ item.unit }}
      </div>
    </div>
  </div>


  <!-- 选择HDR 选择UV图 选择音效 的弹窗 -->
  <el-dialog
    :title="selectTitle"
    class="text-white create-card"
    center
    v-model="isOpen"
    :modal-append-to-body="false"
    width="75%"
  >
    <div
      class="mt-2 overflow-y-scroll h-96 flex flex-wrap"
      v-if="selectTitle == '选择HDR'"
    >
      <div
        v-for="(item, i) in jpgList"
        :key="i"
        class="v self-center w-40 h-auto relative"
      >
        <div
          class="w-40 h-20 self-center mx-auto mt-2 cursor-pointer"
          @click="ClickItem(selectTitle, i)"
        >
          <img
            class="w-full h-full object-fill hover:opacity-70"
            :src="$uploadHDRUrl + item"
          />
        </div>
      </div>
    </div>

    <div
      class="mt-2 overflow-y-scroll h-96 flex flex-wrap gap-2"
      v-if="selectTitle == '选择音效'"
    >
      <div
        v-for="(item, i) in audioList"
        :key="i"
        class="v self-center w-40 h-auto relative"
      >
        <div
          class="w-40 h-20 self-center mx-auto mt-2 cursor-pointer"
          @click="ClickItem(selectTitle, i)"
        >
          <div class="rounded-xl bg-gray-100 border w-full h-8">
            <audio
              class="w-full h-full"
              controls
              :src="this.$uploadAudioUrl + item.folderBase + '/' + item.name"
            ></audio>
          </div>

          <div class="flex flex-wrap w-5/6 gap-3">
            <div
              v-for="(tagItem, ii) in item.tags"
              :key="ii"
              class="border rounded-3xl border-gray-300 w-full h-8"
            >
              <div class="flex h-full text-gray-600">
                <div class="self-center mx-auto px-4 truncate">
                  {{ tagItem }}
                </div>
              </div>
            </div>
          </div>
          <div class="truncate">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <div
      class="mt-2 overflow-y-scroll h-auto max-h-96 flex flex-wrap"
      v-if="selectTitle == '选择通用图片'"
    >
      <div
        v-for="(item, i) in uvAnimList"
        :key="i"
        class="self-center w-16 h-16 relative"
      >
        <div
          class="w-full h-full p-px self-center mx-auto cursor-pointer"
          @click="ClickItem(selectTitle, i)"
        >
          <img
            class="w-full h-full object-fill hover:opacity-70"
            :src="$uploadUVAnimUrl + item"
          />
        </div>
      </div>
    </div>


    <YJinputCtrl_task v-if="selectTitle=='选择任务' " class="w-full h-20" />
    <YJinputCtrl_shop v-if="selectTitle=='选择商品' " class="w-full h-20" />
    
    <div
      class="mt-2 overflow-y-scroll h-96 flex flex-wrap"
      v-if="selectTitle == '选择道具'"
    >
      <div
        v-for="(item, i) in propList"
        :key="i"
        class="v self-center w-40 h-auto relative"
      >
        <div
          class="w-16 h-16 self-center mx-auto mt-2 cursor-pointer"
          @click="ClickItem(selectTitle, i)"
        >
          <img
            class="w-full h-full object-fill hover:opacity-70"
            :src="$uploadUVAnimUrl + item.icon"
          />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
    

    <div
      class="mt-2 overflow-y-scroll h-96 flex flex-wrap"
      v-if="selectTitle == '选择特效'"
    >
      <div
        v-for="(item, i) in particleList"
        :key="i"
        class="v self-center w-40 h-auto relative"
      >
        <div
          class="w-16 h-16 self-center mx-auto mt-2 cursor-pointer"
          @click="ClickItem(selectTitle, i)"
        >
          <img
            class="w-full h-full object-fill hover:opacity-70"
            :src="$uploadGroupUrl + item.icon"
          />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
    
    <div
      class="mt-2 overflow-y-scroll h-96 flex flex-wrap"
      v-if="
        selectTitle == '选择武器' ||
        selectTitle == '选择装备' ||
        selectTitle == '静态模型' ||
        selectTitle == '选择equip' ||
        selectTitle == '选择avatar'
      "
    >
      <div
        v-for="(item, i) in modelList"
        :key="i"
        class="v self-center w-40 h-auto relative"
      >
        <div
          class="w-16 h-16 self-center mx-auto mt-2 cursor-pointer"
          @click="ClickItem(selectTitle, i)"
        >
          <img
            class="w-full h-full object-fill hover:opacity-70"
            :src="$uploadUrl + item.icon"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import YJinput_toggle from "./YJinput_toggle.vue";
import YJinput_color from "./YJinput_color.vue";
import YJinput_range from "./YJinput_range.vue";
import YJinput_upload from "./YJinput_upload.vue";
import YJinput_text from "./YJinput_text.vue";
import YJinput_textarea from "./YJinput_textarea.vue";
import YJinput_number from "./YJinput_number.vue";
import YJinput_drop from "./YJinput_drop.vue";
import YJinput_vector2 from "./YJinput_vector2.vue";
import YJinput_vector2xy from "./YJinput_vector2xy.vue";
import YJinput_vector3 from "./YJinput_vector3.vue";
import YJinput_vector3xyz from "./YJinput_vector3.vue";

import YJinputCtrl_task from "./YJinputCtrl_task.vue";
import YJinputCtrl_shop from "./YJinputCtrl_shop.vue";

import {
  GetAllHDR,
  GetAllAudio,
  GetAllUVAnim,
  GetAllGroup,
  GetAllModel,
} from "../../../js/uploadThreejs.js";

export default {
  name: "YJinputCtrl",
  props: ["setting"],
  components: {
    YJinput_toggle,
    YJinput_color,
    YJinput_range,
    YJinput_upload,
    YJinput_text,
    YJinput_textarea,
    YJinput_number,
    YJinput_drop,
    YJinput_vector3,
    YJinput_vector2,
    YJinput_vector2xy,
    YJinput_vector3xyz,
    YJinputCtrl_task,
    YJinputCtrl_shop,
  },
  data() {
    return {
      // 加载hdr图片
      hdrList: [],
      uvAnimList: [],
      particleList: [],
      jpgList: [],
      settingIndex: -1,
      audioList: [],
      modelList: [],
      propList:[], 
      selectTitle: "",
      isOpen: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    SelectUVAnim(item, i) {
      this.selectTitle = "选择通用图片";
      this.RequestGetAll(this.selectTitle);
      this.isOpen = true;
      this.settingIndex = i;
    },
    SelectHDR(item, i) {
      this.selectTitle = "选择HDR";
      this.RequestGetAll(this.selectTitle);

      this.isOpen = true;
      this.settingIndex = i;
    },
    SelectAudio(item, i) {
      this.selectTitle = "选择音效";
      this.RequestGetAll(this.selectTitle);

      this.isOpen = true;
      this.settingIndex = i;
    },

    SelectItem(e, item, i) {
      this.settingIndex = i;
      this.selectTitle = e;
      if (e == "选择特效") {
        this.selectTitle = e;
      }
      if (e == "选择武器" || e == "选择装备") {
        this.selectTitle = e;
      }
      if (e == "选择avatar") {
        this.selectTitle = e;
      }

      if (e == "选择HDR") {
        this.selectTitle = e;
      }
      if (e == "选择通用图片") {
        this.selectTitle = e;
      }
      if (e == "选择音效") {
        this.selectTitle = e;
      }
      if (e == "移除特效") {
        this.ClickUVAnim("");
        return;
      }
      if (e == "移除音效") {
        this.ClickUVAnim("");
        return;
      }

      if (e == "移除武器") {
        this.ClickUVAnim("");
        return;
      }
      this.RequestGetAll(this.selectTitle);
      
      this.isOpen = true;
    },
    SelectItem2(e,type,j){
      this.selectSecondIndex = j;
      if (e == "选择装备或道具") {
        if(type=='equip'){
          this.selectTitle = "选择equip";
        }
        if(type=='prop'){
          this.selectTitle = "选择道具";
        } 
      }
      if (e == "选择任务") {
        this.selectTitle = e;
      }
      if (e == "选择商品") {
        this.selectTitle = e;
      }
      
      this.RequestGetAll(this.selectTitle);
      this.isOpen = true;
    },

    ClickAudio(item) {},
    ClickItem(e, i) {
      if (e == "选择通用图片") {
        this.ClickUVAnim(this.uvAnimList[i]);
      }
      if (e == "选择HDR") {
        this.ClickHDR(i);
      }
      if (e == "选择特效") {
        this.ClickUVAnim(this.particleList[i].folderBase);
      }
      if (e == "选择音效") {
        this.ClickUVAnim(
          this.audioList[i].folderBase + "/" + this.audioList[i].name
        );
      }

      if (e == "选择武器" || e == "选择装备" ) {
        this.ClickUVAnim(this.modelList[i]);
      }
      if ( e == "静态模型") {
        this.ClickUVAnim(this.modelList[i].folderBase);
      }
      if (e == "选择avatar") {
        this.ClickUVAnim(this.modelList[i]);
      }
      if (e == "移除装备") {
        this.ClickParent(e, i);
        return;
      }

      if (e == "选择道具") {
        this.$parent.$parent.$parent.$parent.selectEquip('prop',this.propList[i],this.selectSecondIndex); 
      }
      if (e == "选择equip") {
        this.$parent.$parent.$parent.$parent.selectEquip('equip',this.modelList[i],this.selectSecondIndex); 
      }
      
      this.selectSecondIndex = -1;
      this.settingIndex = -1;
      this.isOpen = false;
    },

    ClickParticle(i) {
      this.$parent.ClickParticle(this.settingIndex, this.particleList[i]);
    },
    ClickHDR(i) {
      this.$parent.ClickHDR(this.settingIndex, this.hdrList[i]);
    },
    ClickParent(e, i) {
      if (this.$parent.ClickItem) {
        this.$parent.ClickItem(e, i);
      } else if (this.$parent.$parent.ClickItem) {
        this.$parent.$parent.ClickItem(e, i);
      } else if (this.$parent.$parent.$parent.ClickItem) {
        this.$parent.$parent.$parent.ClickItem(e, i);
      } else if (this.$parent.$parent.$parent.$parent.ClickItem) {
        this.$parent.$parent.$parent.$parent.ClickItem(e, i);
      }
    },
    ClickUVAnim(item) {
      // console.log(" 选择通用图片 000 ", i, this.$parent
      //   , this.$parent.$parent
      //   , this.$parent.$parent.$parent
      //   , this.$parent.$parent.$parent.$parent
      // );

      if (this.$parent.ClickUVAnim) {
        this.$parent.ClickUVAnim(this.settingIndex, item);
      } else if (this.$parent.$parent.ClickUVAnim) {
        this.$parent.$parent.ClickUVAnim(this.settingIndex, item);
      } else if (this.$parent.$parent.$parent.ClickUVAnim) {
        this.$parent.$parent.$parent.ClickUVAnim(this.settingIndex, item);
      } else if (this.$parent.$parent.$parent.$parent.ClickUVAnim) {
        this.$parent.$parent.$parent.$parent.ClickUVAnim(
          this.settingIndex,
          item
        );
      }
    },
    async RequestGetAll(type) {
      if (type == "选择HDR") {
        GetAllHDR().then((res) => {
          // console.log("获取所有 hdr ", res);
          //先记录旧照片
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              if (element.includes("hdr")) {
                this.hdrList.push(element);
              } else {
                this.jpgList.push(element);
              }
            }
          }
        });
        return;

      }

      if (type == "选择音效") {
        GetAllAudio().then((res) => {
          // console.log("获取所有 hdr ", res);
          this.audioList = [];
          //先记录旧照片
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              this.audioList.push(element);
            }
          }
        });
        return;

      }
      if (type == "选择通用图片") {
        this.uvAnimList = [];
        GetAllUVAnim().then((res) => {
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              this.uvAnimList.push(element);
            }
          }
        });
        return;

      }

      if (type == "选择特效") {
        this.particleList = [];
        GetAllGroup().then((res) => {
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;
            for (let i = 0; i < txtDataList.length; i++) {
              const element = txtDataList[i];
              this.particleList.push(element);
            }
          }
        });
        return;
      }

      if (type == "选择武器" || type == "选择装备" || type == "选择avatar" || type == "选择equip" || true) {
        let selectModelTable = this.selectTitle;
        let selectModelTable2 = "";
        if (type == "选择avatar") {
          selectModelTable = "角色模型";
        }
        if (type == "选择装备") {
          selectModelTable = "装备模型";
          selectModelTable2 = "武器模型";
        }
        
        if (type == "选择武器") {
          selectModelTable = "武器模型";
        }

        if (type == "选择equip") {
          selectModelTable = "装备模型";
          selectModelTable2 = "武器模型";
        }
        // console.log(" 浏览筛选 ", selectModelTable,selectModelTable2);
        this.modelList = [];
        GetAllModel().then((res) => {
          //先记录旧照片
          if (res.data.txtDataList) {
            let txtDataList = res.data.txtDataList;

            let modelsList = [];
            for (let i = 0; i < txtDataList.length; i++) {
              let element = txtDataList[i];
              try {
                modelsList.push(JSON.parse(element));
              } catch (error) {
                element = element.substring(1);
                modelsList.push(JSON.parse(element));
              }
            }
            // console.log("获取所有单品模型 ", modelsList);

            for (let i = 0; i < modelsList.length; i++) {
              let item = modelsList[i];
              if (item.modelType == selectModelTable || (selectModelTable2!="" && item.modelType == selectModelTable2)) {
                item.icon = item.folderBase + "/" + "thumb.png";
                this.modelList.push(item);
              }
            }
          }
        });
      }
      
      if (type == "选择道具") {
        this.propList = _Global.propList;
        return;
      } 
    },
    focus() {
      // console.log(" in YJinputCtrl 取消焦点 ");
      if (this.$parent.$parent.removeThreeJSfocus) {
        this.$parent.$parent.removeThreeJSfocus();
      }
      if (this.$parent.$parent.$parent.removeThreeJSfocus) {
        this.$parent.$parent.$parent.removeThreeJSfocus();
      }
    },
    blur() {},
  },
};
</script>

<style scoped></style>
