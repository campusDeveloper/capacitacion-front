<template>
    <ModalFull ref="refModalManageUser" :title="isCreate == 1 ? 'Crear usuario' : 'Editar usuario'" destroyOnClose
        class-content="w-[90%] ps-32 mx-auto">
        <Form ref="refFormManage"  @submit="onSubmitClient" :initial-values="model"
            class="vstack text-black-300 rounded-xl mt-6 bg-[rgb(var(--xx-color-card-surface-active-rest))] mx-auto gap-y-3 p-8 w-[623px] !shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]">
            <p class="f-hs text-mid-gray-600">Datos básicos</p>
            <p class="f-tm-16">Agrega los respectivos datos básicos del usuario</p>
            <Field v-slot="{ field, errorMessage }" name="name" label="nombre" rules="required|max:60">
                <div class="vstack gap-y-1 mt-4">
                    <p class="f-tm-14">Nombre*</p>
                    <el-input v-model="model.name" placeholder="Digita el nombre" size="large" class="w-full"
                        v-bind="field" />
                    <Error server="name" :local="errorMessage" v-bind="field" />
                </div>
            </Field>
            <Field v-slot="{ field, errorMessage }" name="email" label="correo electrónico"
                rules="required|email|max:80">
                <div class="vstack gap-y-1 mt-4">
                    <p class="f-tm-14">Correo electrónico*</p>
                    <el-input v-model="model.email" placeholder="Digita el correo electrónico" size="large"
                        class="!w-full" v-bind="field" />
                    <Error :server="errorMessage" :local="errorMessage" v-bind="field" />
                </div>
            </Field>
            <Field v-slot="{ field, errorMessage }" name="idRol" label="tipo de usuario" rules="required">
                <div class="vstack gap-y-1 mt-4">
                    <p class="f-tm-14">Tipo de usuario*</p>
                    <el-select v-model="model.idRol" class="!w-full" size="large" placeholder="Seleccionar el tipo"
                        v-bind="field" popper-class="z-index-over">
                        <el-option v-for="userType in userTypeOptions" :key="userType.idRol" :label="userType.name"
                            :value="userType.idRol" />
                    </el-select>
                    <Error :server="errorMessage" :local="errorMessage" v-bind="field" />
                </div>
            </Field>
            <div class="d-middle gap-x-6">
                <el-checkbox v-model="model.specialAgent" :true-value="1" :false-value="0" size="large">
                    <p class="text-black-300">
                        Agente especializado
                        <i class="icon-magic-star text-brand-500" />
                    </p>
                </el-checkbox>

                <el-checkbox v-model="model.paymentAgent" :true-value="1" :false-value="0" size="large">
                    <p class="text-black-300">
                        Agente de pago
                        <i class="icon-dollar-circle text-green-s-500" />
                    </p>
                </el-checkbox>
            </div>
            <Field v-slot="{ field, errorMessage }" name="idSede" label="sede" rules="required">
                <div class="vstack gap-y-1 mt-4">
                    <p class="f-tm-14">Sede</p>
                    <el-select v-model="model.idSede" class="!w-full" size="large" placeholder="Selecciona la sede"
                        v-bind="field" popper-class="z-index-over" @change="onSedeChange">
                        <el-option v-for="userType in optionsSede" :key="userType.idHeadquarter" :label="userType.name"
                            :value="userType.idHeadquarter" />
                    </el-select>
                    <Error :server="errorMessage" :local="errorMessage" v-bind="field" />
                </div>
            </Field>
            <Field v-if="isCreate == 1" v-slot="{ field, errorMessage }" name="headquarters">
                <p class="f-tm-14">Sedes Secundarias</p>
                <div v-for="(item, index) in secondarySede" :key="index" class="d-middle gap-x-2 mb-1">
                    <el-checkbox v-model="item.value" :true-value="1" :false-value="0" :indeterminate="false"
                        size="small" :disabled="item.idHeadquarter === model.idSede" />
                    <p class="f-t-14 text-black-300">{{ item.name }}</p>
                </div>
            </Field>
            <Field v-slot="{ field, errorMessage }" name="password" label="contraseña"
                :rules="isCreate == 1 ? 'required|max:70' : 'max:70'">
                <div class="vstack gap-y-1 mt-4">
                    <p class="f-tm-14">Contraseña*</p>
                    <el-input v-model="model.password" placeholder="Digita una contraseña" size="large" class="!w-full"
                        v-bind="field" type="password" />
                    <Error :server="errorMessage" :local="errorMessage" v-bind="field" />
                </div>
            </Field>
            <div class="d-middle-end gap-x-4 mt-5">
                <Button type-style="secondary" type="button" size="large" class="!w-[117px]"
                    @click="close">Cancelar</Button>
                <Button size="large" type="submit" class="!w-[104px]">{{ isCreate == 1 ? 'Crear' : 'Guardar' }}</Button>
            </div>
        </Form>
    </ModalFull>
</template>

<script setup>
import { ref } from 'vue';
import { Form, Field } from 'vee-validate'
import { request } from '@request'
import { getHeadquarters } from '../../configuration/services/knowledgeService';
import { createUser } from '../services/userService';

const refModalManageUser = ref()
const refFormManage = ref()
const isCreate = ref(1);
const isLoaded = ref(false)
const emit = defineEmits(['success'])

const model = ref({
    name: null,
    email: null,
    password: null,
    specialAgent: 0,
    paymentAgent: 0,
    idRol: 1,
    idSede: null
})

const userTypeOptions = ref({
    1: { idRol: 1, name: 'Administrador' },
    2: { idRol: 2, name: 'Comercial' },
})

const optionsSede = ref([])
const secondarySede = ref([])
const editingUserId = ref(null);

/* Functions */
function resetFormData() {
    model.value = {
        name: null,
        email: null,
        password: null,
        specialAgent: 0,
        paymentAgent: 0,
        idRol: 1,
        idSede: null
    }
    secondarySede.value = []
    editingUserId.value = null
}

async function loadHeadquarters() {
    const { data, error } = await request(() => getHeadquarters(), { success: false, error: true })
    if (error) return

    const rows = Array.isArray(data?.data) ? data.data : []
    optionsSede.value = rows.filter((item) => item.idHeadquarter !== null)
    secondarySede.value = optionsSede.value.map((item) => ({
        ...item,
        value: 0
    }))
}

async function onSubmitClient() {
    const validationResult = await refFormManage.value?.validate()
    if (!validationResult?.valid) return

    const payload = {
        name: model.value.name?.trim(),
        email: model.value.email?.trim(),
        password: model.value.password,
        type: model.value.idRol,
        mainHeadquarter: model.value.idSede,
        headquarters: secondarySede.value
            .filter((item) => item.value === 1)
            .map((item) => item.idHeadquarter),
        specialAgent: model.value.specialAgent ? 1 : 0,
        paymentAgent: model.value.paymentAgent ? 1 : 0
    }

    const { error } = await request(() => createUser(payload))
    if (error) return

    close()
    emit('success')
}

async function open(type = 1) {
    isCreate.value = type
    isLoaded.value = false
    refFormManage.value?.resetForm()
    resetFormData()
    await loadHeadquarters()
    isLoaded.value = true
    refModalManageUser.value.open()
}

function onSedeChange() {
    secondarySede.value = secondarySede.value.map((item) => ({
        ...item,
        value: item.idHeadquarter === model.value.idSede ? 0 : item.value
    }))
}

function close() {
    refModalManageUser.value.close()
}

defineExpose({
    open,
    close
})
</script>
