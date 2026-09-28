<script setup lang="ts">
import { computed } from 'vue';
import type { ResumeConfig, ThemeConfig } from '@/types/resume';
import { getDefaultTitleNameMap } from '@/config/titles';
import { useI18n } from '@/composables/useI18n';
import Icon from '../Icon.vue';
import SkillRate from '../SkillRate.vue';
import ModuleSection from '../ModuleSection.vue';

const props = defineProps<{ value: ResumeConfig; theme: ThemeConfig }>();
const { t } = useI18n();

const titleMap = computed(() => ({
  ...getDefaultTitleNameMap(t),
  ...(props.value.titleNameMap ?? {}),
}));

const profile = computed(() => props.value.profile);
const avatar = computed(() => props.value.avatar);
const aboutme = computed(() => (props.value.aboutme?.aboutme_desc ?? '').split('\n'));
const educationList = computed(() => props.value.educationList ?? []);
const workExpList = computed(() => props.value.workExpList ?? []);
const projectList = computed(() => props.value.projectList ?? []);
const skillList = computed(() => props.value.skillList ?? []);
const awardList = computed(() => props.value.awardList ?? []);
const workList = computed(() => props.value.workList ?? []);

const color = computed(() => props.theme.color);
const iconStyle = computed(() => ({ color: color.value, opacity: 0.85 }));

const timeRange = (start?: string, end?: string | number) =>
  `${start ?? ''}${end ? ` ~ ${end}` : ` ${t('至今')}`}`;

const openLink = (url?: string) => url && window.open(url, '_blank');
</script>

<template>
  <div
    class="resume-sheet resume-content print-split grid w-full grid-cols-1 sheet:grid-cols-[2fr_3fr] sheet:w-a4 sheet:min-h-a4 bg-white shadow-sheet"
  >
    <!-- ============ 左栏 ============ -->
    <div class="px-[18px] pb-[24px] pt-[24px] sheet:pl-[24px]">
      <!-- 头像 -->
      <img
        v-if="!avatar?.hidden && avatar?.src"
        :src="avatar.src"
        :class="avatar.shape === 'square' ? 'rounded' : 'rounded-full'"
        class="mx-auto my-[12px] block object-cover"
        :style="{ width: (avatar?.size ?? '84') + 'px', height: (avatar?.size ?? '84') + 'px' }"
        alt="avatar"
      />

      <!-- 姓名 -->
      <div
        v-if="profile?.name"
        class="mb-[24px] mt-[8px] text-center text-[24px]"
      >
        {{ profile.name }}
      </div>

      <!-- 联系方式 -->
      <div class="mb-[24px]">
        <div
          v-if="profile?.mobile"
          class="mb-[4px] flex items-center break-all"
        >
          <Icon name="mobile" :style="iconStyle" class="mr-[8px]" />
          {{ profile.mobile }}
        </div>
        <div v-if="profile?.email" class="mb-[4px] flex items-center break-all">
          <Icon name="mail" :style="iconStyle" class="mr-[8px]" />
          {{ profile.email }}
        </div>
        <div v-if="profile?.github" class="mb-[4px] flex items-center break-all">
          <Icon name="github" :style="iconStyle" class="mr-[8px]" />
          <span class="cursor-pointer" @click="openLink(profile.github)">
            {{ profile.github }}
          </span>
        </div>
        <div v-if="profile?.zhihu" class="mb-[4px] flex items-center break-all">
          <Icon name="zhihu" :style="iconStyle" class="mr-[8px]" />
          <span class="cursor-pointer" @click="openLink(profile.zhihu)">
            {{ profile.zhihu }}
          </span>
        </div>
        <div
          v-if="profile?.workExpYear"
          class="mb-[4px] flex items-center break-all"
        >
          <Icon name="clock" :style="iconStyle" class="mr-[8px]" />
          <span>{{ t('工作经验') }}: {{ profile.workExpYear }}</span>
        </div>
        <div
          v-if="profile?.workPlace"
          class="mb-[4px] flex items-center break-all"
        >
          <Icon name="location" :style="iconStyle" class="mr-[8px]" />
          <span>{{ t('工作地') }}: {{ profile.workPlace }}</span>
        </div>
        <div
          v-if="profile?.positionTitle"
          class="mb-[4px] flex items-center break-all"
        >
          <Icon name="heart" :style="iconStyle" class="mr-[8px]" />
          <span>{{ t('职位') }}: {{ profile.positionTitle }}</span>
        </div>
      </div>

      <!-- 自我介绍 -->
      <ModuleSection
        v-if="aboutme.join('').trim()"
        class="sheet:mt-[24px] sheet:first:mt-0"
      >
        <template #title>
          <div class="mb-[12px] text-[24px] leading-[32px]">
            {{ titleMap.aboutme }}
          </div>
        </template>
        <div v-for="(line, idx) in aboutme" :key="idx" class="my-[6px]">
          {{ line }}
        </div>
      </ModuleSection>

      <!-- 教育背景 -->
      <ModuleSection v-if="educationList.length" class="sheet:mt-[24px]">
        <template #title>
          <div class="mb-[12px] text-[24px] leading-[32px]">
            {{ titleMap.educationList }}
          </div>
        </template>
        <div
          v-for="(edu, idx) in educationList"
          :key="idx"
          class="sheet:mt-[8px] module-item"
        >
          <div>
            <b>{{ edu.school }}</b>
            <span class="float-right text-black/45">
              {{ timeRange(edu.edu_time?.[0], edu.edu_time?.[1]) }}
            </span>
          </div>
          <div>
            <span v-if="edu.major">{{ edu.major }}</span>
            <span v-if="edu.academic_degree" class="ml-[4px] text-black/45">
              ({{ edu.academic_degree }})
            </span>
          </div>
        </div>
      </ModuleSection>

      <!-- 个人作品 -->
      <ModuleSection v-if="workList.length" class="sheet:mt-[24px]">
        <template #title>
          <div class="mb-[12px] text-[24px] leading-[32px]">
            {{ titleMap.workList }}
          </div>
        </template>
        <div v-for="(work, idx) in workList" :key="idx" class="leading-[24px] module-item">
          <div>
            <Icon name="crown" class="mr-[8px] text-[#ffc107]" />
            <b>{{ work.work_name }}</b>
            <a
              v-if="work.visit_link"
              :href="work.visit_link"
              target="_blank"
              class="ml-[8px] text-[12px] text-black/45 underline"
            >
              {{ t('访问链接') }}
            </a>
          </div>
          <div v-if="work.work_desc">{{ work.work_desc }}</div>
        </div>
      </ModuleSection>

      <!-- 专业技能 -->
      <ModuleSection v-if="skillList.length" class="sheet:mt-[24px]">
        <template #title>
          <div class="mb-[12px] text-[24px] leading-[32px]">
            {{ titleMap.skillList }}
          </div>
        </template>
        <template v-for="(skill, idx) in skillList" :key="idx">
          <div class="module-item">
            <div
              v-if="skill"
              class="mt-[8px] flex items-center justify-between gap-2"
            >
              <b>{{ skill.skill_name }}</b>
              <SkillRate :value="skill.skill_level ?? 0" />
            </div>
            <div
              v-for="(line, i) in (skill?.skill_desc ?? '').split('\n')"
              :key="`${idx}-${i}`"
              class="mt-[4px]"
            >
              <template v-if="line">
                <Icon name="check" class="mr-[8px] text-[#ffc107]" />
                {{ line }}
              </template>
            </div>
          </div>
        </template>
      </ModuleSection>

      <!-- 更多信息 -->
      <ModuleSection v-if="awardList.length" class="sheet:mt-[24px]">
        <template #title>
          <div class="mb-[12px] text-[24px] leading-[32px]">
            {{ titleMap.awardList }}
          </div>
        </template>
        <div v-for="(award, idx) in awardList" :key="idx" class="module-item">
          <Icon name="trophy" class="mr-[8px] text-[#ffc107]" />
          <b>{{ award.award_info }}</b>
          <span v-if="award.award_time" class="ml-[8px] text-[14px] text-black/45">
            ({{ award.award_time }})
          </span>
        </div>
      </ModuleSection>
    </div>

    <!-- ============ 右栏 ============ -->
    <div class="bg-[#f2f2f2] px-[24px] pb-[32px] pt-[24px] sheet:pl-[20px] sheet:pt-[33px]">
      <!-- 工作经历 -->
      <ModuleSection v-if="workExpList.length" :flow="true" class="mb-[16px]">
        <template #title>
          <div class="mb-[10px] flex items-center">
            <Icon name="tags" size="26" :color="color" class="mr-[8px]" />
            <div class="relative">
              <h1
                :style="{ background: color }"
                class="rounded-l-[3px] py-0 pl-[10px] pr-[100px] text-[18px] font-bold leading-[26px] text-white"
              >
                {{ titleMap.workExpList }}
              </h1>
              <span
                class="absolute right-[-9px] top-[4px] h-[18.4px] w-[18.4px] rotate-45 bg-[#f2f2f2]"
              />
            </div>
          </div>
        </template>
        <div>
          <div
            v-for="(work, idx) in workExpList"
            :key="idx"
            class="sheet:mt-[18px] sheet:first:mt-0 module-item"
          >
            <div class="mb-[8px] flex items-center justify-between text-[18px] leading-[24px] text-black/85">
              <b>
                {{ work.company_name }}
                <span class="ml-[8px] text-[12px] font-light text-black/45">
                  {{ work.department_name }}
                </span>
              </b>
              <span class="text-[12px] font-light text-black/45">
                {{ timeRange(work.work_time?.[0], work.work_time?.[1]) }}
              </span>
            </div>
            <div class="white-space-pre">{{ work.work_desc }}</div>
          </div>
        </div>
      </ModuleSection>

      <!-- 项目经历 -->
      <ModuleSection v-if="projectList.length" :flow="true" class="mb-[16px]">
        <template #title>
          <div class="mb-[10px] flex items-center">
            <Icon name="project" size="26" :color="color" class="mr-[8px]" />
            <div class="relative">
              <h1
                :style="{ background: color }"
                class="rounded-l-[3px] py-0 pl-[10px] pr-[100px] text-[18px] font-bold leading-[26px] text-white"
              >
                {{ titleMap.projectList }}
              </h1>
              <span
                class="absolute right-[-9px] top-[4px] h-[18.4px] w-[18.4px] rotate-45 bg-[#f2f2f2]"
              />
            </div>
          </div>
        </template>
        <div>
          <div
            v-for="(project, idx) in projectList"
            :key="idx"
            class="sheet:mt-[18px] sheet:first:mt-0 module-item"
          >
            <div class="mb-[8px] flex items-center justify-between text-[18px] leading-[24px] text-black/85">
              <b>
                {{ project.project_name }}
                <span class="ml-[8px] text-[12px] font-light text-black/45">
                  {{ project.project_time }}
                </span>
              </b>
              <span
                v-if="project.project_role"
                :style="{ background: theme.tagColor }"
                class="rounded px-[6px] py-[1px] text-[12px] leading-[20px] text-white"
              >
                {{ project.project_role }}
              </span>
            </div>
            <div v-if="project.project_desc" class="tracking-[1.2px]">
              <b>{{ t('项目描述') }}：</b><span>{{ project.project_desc }}</span>
            </div>
            <div
              v-if="project.project_content"
              class="mt-[4px] tracking-[1.2px]"
            >
              <b>{{ t('主要工作') }}：</b>
              <span class="white-space-pre">{{ project.project_content }}</span>
            </div>
          </div>
        </div>
      </ModuleSection>
    </div>
  </div>
</template>
