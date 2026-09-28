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
  <div class="resume-sheet resume-content w-full bg-white shadow-sheet sheet:w-a4">
    <div class="px-[24px] pb-[12px] pt-[18px]">
      <!-- 个人信息 + 头像 -->
      <div class="mb-[12px] flex flex-wrap-reverse items-center justify-between">
        <div class="flex-1">
          <div v-if="profile?.name" class="mb-[8px] ml-[4px] text-[24px] leading-[36px]">
            {{ profile.name }}
          </div>
          <div class="ml-[4px] flex flex-wrap">
            <div v-if="profile?.mobile" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="mobile" :style="iconStyle" class="mr-[8px]" />
              {{ profile.mobile }}
            </div>
            <div v-if="profile?.email" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="mail" :style="iconStyle" class="mr-[8px]" />
              {{ profile.email }}
            </div>
            <div v-if="profile?.github" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="github" :style="iconStyle" class="mr-[8px]" />
              <span class="cursor-pointer" @click="openLink(profile.github)">
                {{ profile.github }}
              </span>
            </div>
            <div v-if="profile?.zhihu" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="zhihu" :style="iconStyle" class="mr-[8px]" />
              <span class="cursor-pointer" @click="openLink(profile.zhihu)">
                {{ profile.zhihu }}
              </span>
            </div>
            <div v-if="profile?.workExpYear" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="clock" :style="iconStyle" class="mr-[8px]" />
              <span>{{ t('工作经验') }}: {{ profile.workExpYear }}</span>
            </div>
            <div v-if="profile?.workPlace" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="location" :style="iconStyle" class="mr-[8px]" />
              <span>{{ t('工作地') }}: {{ profile.workPlace }}</span>
            </div>
            <div v-if="profile?.positionTitle" class="mb-[4px] flex basis-[220px] items-center">
              <Icon name="heart" :style="iconStyle" class="mr-[8px]" />
              <span>{{ t('职位') }}: {{ profile.positionTitle }}</span>
            </div>
          </div>
        </div>

        <div class="w-[150px]">
          <img
            v-if="!avatar?.hidden && avatar?.src"
            :src="avatar.src"
            :class="avatar.shape === 'square' ? 'rounded' : 'rounded-full'"
            class="mx-auto block object-cover"
            :style="{ width: (avatar?.size ?? '84') + 'px', height: (avatar?.size ?? '84') + 'px' }"
            alt="avatar"
          />
        </div>
      </div>

      <!-- ===== 卡片区块 ===== -->
      <!-- 教育背景 -->
      <ModuleSection
        v-if="educationList.length"
        class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm"
      >
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.educationList }}</span>
          </div>
        </template>
        <div class="p-3">
          <div v-for="(edu, idx) in educationList" :key="idx" class="sheet:mt-[8px] sheet:first:mt-0 module-item">
            <div>
              <span>
                <b>{{ edu.school }}</b>
                <span class="ml-[8px]">
                  <span v-if="edu.major">{{ edu.major }}</span>
                  <span v-if="edu.academic_degree" class="ml-[4px] text-black/45">
                    ({{ edu.academic_degree }})
                  </span>
                </span>
              </span>
              <span class="float-right text-black/45">
                {{ timeRange(edu.edu_time?.[0], edu.edu_time?.[1]) }}
              </span>
            </div>
          </div>
        </div>
      </ModuleSection>

      <!-- 个人作品 -->
      <ModuleSection
        v-if="workList.length"
        class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm"
      >
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.workList }}</span>
          </div>
        </template>
        <div class="p-3">
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
        </div>
      </ModuleSection>

      <!-- 自我介绍 -->
      <ModuleSection class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm">
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.aboutme }}</span>
          </div>
        </template>
        <div class="p-3">
          <div v-for="(line, idx) in aboutme" :key="idx">{{ line }}</div>
        </div>
      </ModuleSection>

      <!-- 专业技能 -->
      <ModuleSection
        v-if="skillList.length"
        class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm"
      >
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.skillList }}</span>
          </div>
        </template>
        <div class="p-3">
          <div
            v-for="(skill, idx) in skillList"
            :key="idx"
            class="flex items-center justify-between gap-2 sheet:mt-[2px] sheet:first:mt-0 module-item"
          >
            <span>
              <Icon name="check" class="mr-[8px] text-[#ffc107]" />
              {{ (skill?.skill_desc ?? '').split('\n').join('；') || skill?.skill_name }}
            </span>
            <SkillRate v-if="skill?.skill_level" :value="skill.skill_level" />
          </div>
        </div>
      </ModuleSection>

      <!-- 更多信息 -->
      <ModuleSection
        v-if="awardList.length"
        class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm"
      >
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.awardList }}</span>
          </div>
        </template>
        <div class="p-3">
          <div v-for="(award, idx) in awardList" :key="idx" class="module-item">
            <Icon name="trophy" class="mr-[8px] text-[#ffc107]" />
            <b>{{ award.award_info }}</b>
            <span v-if="award.award_time" class="ml-[8px] text-[14px] text-black/45">
              ({{ award.award_time }})
            </span>
          </div>
        </div>
      </ModuleSection>
    </div>

    <div class="bg-white px-[24px] pb-[24px]">
      <!-- 工作经历 -->
      <ModuleSection
        v-if="workExpList.length"
        :flow="true"
        class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm"
      >
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.workExpList }}</span>
          </div>
        </template>
        <div class="p-3">
          <div
            v-for="(work, idx) in workExpList"
            :key="idx"
            class="sheet:mt-[10px] sheet:first:mt-0 module-item"
          >
            <div class="mb-[4px] flex items-center justify-between text-[14px] leading-[16px] text-black/85">
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
      <ModuleSection
        v-if="projectList.length"
        :flow="true"
        class="mt-3 overflow-hidden rounded border border-gray-200 shadow-sm"
      >
        <template #title>
          <div class="flex items-center px-3 py-[6px]" :style="{ background: color }">
            <span class="text-[15px] font-medium text-white">{{ titleMap.projectList }}</span>
          </div>
        </template>
        <div class="p-3">
          <div
            v-for="(project, idx) in projectList"
            :key="idx"
            class="sheet:mt-[10px] sheet:first:mt-0 module-item"
          >
            <div class="mb-[4px] flex items-center justify-between text-[14px] leading-[16px] text-black/85">
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
            <div v-if="project.project_content" class="mt-[4px] tracking-[1.2px]">
              <b>{{ t('主要工作') }}：</b>
              <span class="white-space-pre">{{ project.project_content }}</span>
            </div>
          </div>
        </div>
      </ModuleSection>
    </div>
  </div>
</template>
