<template>
    <el-card class="box">
        <template #header>
            <div class="header">
                <el-icon :class="{ 'is-loading': filterConfig.status, 'running-icon': true }">
                    <orange />
                </el-icon>
                <el-switch
                    v-model="filterConfig.status"
                    class="switch-form-item"
                    inline-prompt
                    :width="50"
                    :active-value="true"
                    :inactive-value="false"
                    :active-icon="icons.Filter"
                    :inactive-icon="icons.Close"
                    @change="onStatusSwitch"
                />
            </div>
        </template>
        <div>
            <el-form
                ref="configForm"
                label-position="top"
                size="small"
                :model="filterConfig"
                :rules="filterConfigRules"
            >
                <el-form-item label="Intercepted Path" prop="route">
                    <el-radio-group
                        v-model="filterConfig.routeProtocol"
                        @change="onFormContentChange"
                    >
                        <el-radio label="http" value="HTTP"></el-radio>
                        <el-radio label="https" value="HTTPS"></el-radio>
                    </el-radio-group>
                    <el-input
                        v-model="filterConfig.route"
                        :prefix-icon="icons.Link"
                        @change="onFormContentChange"
                    />
                </el-form-item>
                <el-form-item label="Target Host" prop="redirect">
                    <el-radio-group
                        v-model="filterConfig.redirectProtocol"
                        @change="onFormContentChange"
                    >
                        <el-radio label="http" />
                        <el-radio label="https" />
                    </el-radio-group>
                    <el-input
                        v-model="filterConfig.redirect"
                        :prefix-icon="icons.Right"
                        @change="onFormContentChange"
                    />
                </el-form-item>
                <el-form-item label="Ignore Path" prop="ignore">
                    <el-input
                        v-model="filterConfig.ignore"
                        :prefix-icon="icons.Remove"
                        @change="onFormContentChange"
                    />
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
    ElCard,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInput,
    ElSwitch,
    ElRadioGroup,
    ElRadio,
} from 'element-plus';
import { Close, Filter, Link, Orange, Remove, Right } from '@element-plus/icons';

import { initialization } from '@/composables/initialization';
import { formController } from '@/composables/form-controller';

export default defineComponent({
    name: 'App',
    components: {
        ElForm,
        ElFormItem,
        ElInput,
        ElSwitch,
        ElCard,
        ElIcon,
        ElRadioGroup,
        ElRadio,
        Orange,
    },
    setup() {
        const { filterConfig, filterConfigRules } = initialization();

        const { configForm, onStatusSwitch, onFormContentChange } = formController(filterConfig);

        const icons = {
            Link,
            Right,
            Remove,
            Close,
            Filter,
        };

        return {
            icons,
            configForm,
            filterConfig,
            filterConfigRules,
            onStatusSwitch,
            onFormContentChange,
        };
    },
});
</script>
<style lang="scss">
body {
    margin: 0;
    padding: 0;
}
[data-theme='dark'] {
    --el-text-color-regular: #c9d1d9;
    .el-card {
        --el-card-border-color: #f78166;
        --el-card-background-color: #0d1117;
    }
    .el-input {
        --el-input-font-color: #c9d1d9;
        --el-input-border: 1px solid #30363d;
        --el-input-border-color: #30363d;
        --el-input-background-color: #010409;
        --el-input-icon-color: var(--el-text-color-placeholder);
        --el-input-placeholder-color: #010409;
    }
}
.el-card {
    border: none;
    border-radius: 0;
}
.box {
    width: 480px;
}
.header {
    overflow: hidden;
    .switch-form-item {
        float: right;
    }
    .running-icon {
        font-size: 18px;
    }
    .is-loading {
        color: #e6a23c;
    }
}
</style>
