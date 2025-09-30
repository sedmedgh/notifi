<template>
  <section style="display: grid; gap: 12px">
    <ConfigProvider
      :theme="{
        init: true,
        theme: 'custom',
        dark: isDark,
      }"
    >
      <NotifContainer v-bind="containerProps" />

      <div class="controllers">
        <div class="controllerTitle">ContainerProps :</div>
        <FormItem name="expand" label="expanded :" v-slot="{ id }">
          <Checkbox :id v-model="containerProps.expand" />
        </FormItem>
        <FormItem name="position" label="position :" v-slot="{ id }">
          <Select
            :id
            v-model="containerProps.position"
            :options="[
              'bottom-end',
              'bottom-center',
              'bottom-start',
              'top-start',
              'top-end',
              'top-center',
            ]"
          />
        </FormItem>
        <FormItem name="visibleNotifications" label="count :" v-slot="{ id }">
          <InputNumber :id v-model="containerProps.visibleNotifications" />
        </FormItem>
        <FormItem name="gap" label="gap :" v-slot="{ id }">
          <InputNumber :id v-model="containerProps.gap" />
        </FormItem>
        <div class="controllerTitle">NotificationProps :</div>
        <FormItem name="duration" label="duration :" v-slot="{ id }">
          <InputNumber :id v-model="notifProps.duration" />
        </FormItem>
        <FormItem name="dismissible" label="dismissible :" v-slot="{ id }">
          <Checkbox :id v-model="notifProps.dismissible" />
        </FormItem>
        <FormItem
          name="noPauseOnHover"
          label="noPauseOnHover :"
          v-slot="{ id }"
        >
          <Checkbox :id v-model="notifProps.noPauseOnHover" />
        </FormItem>
        <FormItem name="notifPosition" label="position :" v-slot="{ id }">
          <Select
            :id
            v-model="notifProps.position"
            :options="[
              'bottom-end',
              'bottom-center',
              'bottom-start',
              'top-start',
              'top-end',
              'top-center',
            ]"
          />
        </FormItem>
      </div>

      <div style="display: flex; gap: 12px">
        <Button @click="show">Show notification</Button>
        <Button @click="clearAll" color="danger" type="ghost">
          Clear All notifications
        </Button>
      </div>
    </ConfigProvider>
  </section>
</template>

<script setup lang="ts">
import "@pantograph/vue/style";
import {
  Toast,
  ConfigProvider,
  Button,
  FormItem,
  Checkbox,
  Select,
  InputNumber,
} from "@pantograph/vue";
import { toggleDark } from "@pantograph/tokens";
import { NotifContainer, notif } from "@notifi/vue";
import "@notifi/core/style.css";
import { h, ref, watch } from "vue";
import { useData } from "vitepress";

const { isDark } = useData();
watch(isDark, (value) => {
  toggleDark(value);
});

const containerProps = ref({
  expand: true,
  position: "bottom-end",
  visibleNotifications: 5,
  gap: 8,
});

const notifProps = ref({
  duration: 2500,
  dismissible: true,
  noPauseOnHover: false,
  position: "bottom-end",
});

function show() {
  return notif(
    h(
      Toast,
      {
        type: "info",
        title: "hellow",
        progress: true,
        description: "description",
      },
      {
        actions: [
          h(Button, { size: "sm", text: "action" }),
          h(Button, {
            size: "sm",
            text: "clearAll",
            onClick: clearAll,
            color: "danger",
            type: "ghost",
          }),
        ],
      },
    ),
    {
      ...notifProps.value,
    },
  );
}

function clearAll() {
  notif.dismiss();
}
</script>

<style>
ol {
  margin: 0 !important;
  list-style: none !important;
}
.custom-theme {
  --pt-primary-0: var(--pt-yellow-0);
  --pt-primary-1: var(--pt-yellow-1);
  --pt-primary-2: var(--pt-yellow-2);
  --pt-primary-3: var(--pt-yellow-3);
  --pt-primary-4: var(--pt-yellow-4);
  --pt-primary-5: var(--pt-yellow-5);
  --pt-primary-6: var(--pt-yellow-6);
  --pt-primary-7: var(--pt-yellow-7);
  --pt-primary-8: var(--pt-yellow-8);
  --pt-primary-9: var(--pt-yellow-9);
  --pt-primary-oncolor: var(--pt-grayscale-light-10);
}
.controllers {
  position: relative;
  background-color: var(--vp-code-block-bg);
  padding: 24px;
  border-radius: 8px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.pc_form__item {
  flex-direction: row;
  align-items: center;
}
.controllerTitle {
  grid-column: span 2 / span 2;
}
.pc_form__item__input {
  flex: 1 1 0%;
}
</style>
