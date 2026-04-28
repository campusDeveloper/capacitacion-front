<template>
    <ModalRight ref="refModalManageType" :title="`${isAdd ? 'Crear' : 'Editar'} tipo de cliente`" destroyOnClose>
        <p class="f-t-14">Agrega un título y un color para la etiqueta</p>
        <Form ref="refFormState" :initial-values="form">
            <Field v-slot="{ field, errorMessage }" name="name" label="título" rules="required|max:40">
                <p class="f-tm-14 mt-5 pb-1">Título</p>
                <el-input v-model="form.name" placeholder="Agrega un título" size="large" v-bind="field" />
                <Error :local="errorMessage" server="name" v-bind="field" />
            </Field>
            <p class="f-tm-14 mt-5 pb-1">Descripción</p>
            <el-input type="textarea" v-model="form.description" placeholder="Agrega una descripción"
                :autosize="{ minRows: 4, maxRows: 4 }" :maxlength="200" />
            <Field v-slot="{ field, errorMessage }" name="color" label="color" rules="required">
                <div class="d-middle-center">
                    <ColorPicker v-model="form.color" v-bind="field" />
                </div>
                <Error :local="errorMessage" server="color" v-bind="field" />
            </Field>
        </Form>
        <template #footer>
            <div class="d-middle-end gap-x-2">
                <Button type-style="secondary" @click="close" class="min-w-[108px]">Cancelar </Button>
                <Button class="min-w-[112px]" @click="handleInterestState">
                    {{ isAdd == 1 ? 'Agregar' : 'Guardar' }}</Button>
            </div>
        </template>
    </ModalRight>
</template>

<script setup>
import { ref } from 'vue';
import { Field, Form } from 'vee-validate'
import ColorPicker from '@comp/ColorPicker.vue'
import { createCustomerType, updateCustomerType } from '../services/customerTypeService'

const refModalManageType = ref()
const refFormState = ref()

const isAdd = ref(true)
const isClientType = ref(false)
const currentId = ref(null)
const form = ref({
    name: '',
    description: '',
    color: null,
    state: 1
})

/* Functions */
async function handleInterestState() {
    const valid = await refFormState.value.validate()
    if (!valid) return

    try {
        if (isAdd.value) {
            await createCustomerType(form.value)
        } else {
            await updateCustomerType(currentId.value, form.value)
        }
        close()
        emit('update')
    } catch (e) {
        console.error(e)
    }
}

function open(identify = false) {
    isAdd.value = true
    currentId.value = null
    form.value = { name: '', description: '', color: null, state: 1 }
    refFormState.value?.resetForm()
    refModalManageType.value.open()
}

function openEdit(data) {
    isAdd.value = false
    currentId.value = data.id
    form.value = { 
        name: data.name, 
        description: data.description, 
        color: data.color, 
        state: data.state 
    }
    refFormState.value?.resetForm()
    refModalManageType.value.open()
}

function close() {
    refModalManageType.value.close()
}

const emit = defineEmits(['update'])

defineExpose({
    open,
    close,
    openEdit,
});

</script>