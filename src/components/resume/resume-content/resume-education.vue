<template>
    <form class="resume-form" :class="{ 'open': isOpen }">

        <div @click="add" class="resume-title">
            <h1>Education</h1>
            <p v-if="!isOpen">Edit education
                <span v-svg-icon="'expand'" />
            </p>
            <span v-svg-icon="'expand'" v-if="isAdding" @click.stop="close" class="close-btn" />
            <div @click.stop="isModalOpen = true" class="more-options">
                <span v-svg-icon="'options'"></span>
            </div>
            <div v-if="isModalOpen" v-click-outside="closeModal" class="options-modal">
                <div @click="open" class="edit">
                    <span v-svg-icon="'edit'"></span>
                    <h3>Edit</h3>
                </div>
                <div @click.stop="openRemoveModal" class="remove">
                    <span v-svg-icon="'trash'"></span>
                    <h3>Remove</h3>
                </div>
                <div @click.stop="closeModal" class="cancel-modal">
                    <h3>Cancel</h3>
                </div>
            </div>
            <div v-if="isOptionsOpen || isRemoving" @click.stop="closeModal" class="black-screen" />
        </div>

        <remove-modal v-if="isRemoving" @cancel="closeModal" @remove="remove" />


        <div v-if="isAdding" class="add-info">
            <ul class="resume-cmp-list">
                <li @click="edit(ed)" class="resume-cmp-preview" v-for="ed in resume?.education" :key="ed._id">
                    <div>
                        <h3>{{ ed.degree }}<span v-if="ed.degree">,</span></h3>
                        <h4>{{ ed.school }}</h4>
                    </div>
                    <span class="remove" title="Remove" @click.stop="removeDeep(ed._id)" v-svg-icon="'trash'"></span>
                </li>
            </ul>
            <button class="add-btn" @click="openAccordion">
                <span v-svg-icon="'plus'" />
                <p>Education</p>
            </button>
        </div>

        <div v-if="!isAdding && isOpen" class="resume-education">
            <div v-for="input in inputs" :key="input.label" :class="'resume-input ' + input.class">
                <span v-svg-icon="'camera'" v-if="input.type === 'file'" />
                <CFormInput v-model="education[input.name as keyof Education]" @keydown.enter="save" @input="update"
                    :name="input.name" :label="input.label" :type="input.type" :placeholder="input.placeholder"
                    aria-label="default input" />
            </div>
            <div ref="textarea" class="resume-input resume-textarea">
                <CFormTextarea v-model="education.description" @input="update" name="description" label="Description"
                    rows="4" placeholder="Add a description of your education entry...">
                </CFormTextarea>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import { CFormInput, CFormTextarea } from '@coreui/vue';
import { PropType } from 'vue';
import { Education, Resume } from '../../../interfaces/resume-interface';
import { eventBus } from '../../../services/event.bus.service';
import { utilService } from '../../../services/util.service';
import removeModal from '../remove-modal.vue';

export default {
    props: {
        resume: Object as PropType<Resume>,
    },
    emits: ['update', 'open', 'save', 'remove'],
    created() {
        eventBus.on('close-accordion', () => { this.isOpen = false })
        eventBus.on('add-component', (cmp) => {
            if (cmp as any !== 'resume-education') return
            this.add()
            this.openAccordion()
        })
    },
    data() {
        return {
            inputs: [
                { name: 'degree', class: 'degree-input', label: "Degree", type: "text", placeholder: "Enter Degree / Field of Study" },
                { name: 'school', class: 'school-input', label: "School", type: "text", placeholder: "Enter school / university" },
                { name: 'city', class: 'city-input', label: "City", type: "email", placeholder: "Enter City" },
                { name: 'country', class: 'country-input', label: "Country", type: "text", placeholder: "Enter Country" },
            ],
            education: { _id: '', degree: '', school: '', city: '', country: '', description: '' },
            isOpen: false,
            isModalOpen: false,
            isRemoving: false,
            isAdding: false,
            selected: null as string | null
        }
    },
    methods: {
        update() {
            setTimeout(() => {
                const payload = { type: 'education', val: { ...this.education } }
                this.$emit('update', payload)
            }, 0)
        },
        add() {
            this.education = { _id: utilService.makeId(), degree: '', school: '', city: '', country: '', description: '' }
            this.isAdding = true
            this.isOpen = true
        },
        edit(ed: Education) {
            this.education = { ...ed }
            this.openAccordion()
        },
        save() {
            this.$emit('save')
        },
        remove() {
            const val = this.selected
            const payload = { type: 'education', val }
            this.$emit('remove', payload)
            this.closeModal()
        },
        removeDeep(id: string) {
            this.selected = id
            this.openRemoveModal()
        },
        openAccordion() {
            this.isAdding = false
            this.$emit('open', 'resume-education')
        },
        openRemoveModal() {
            this.isRemoving = true
            this.isModalOpen = false
        },
        closeModal() {
            this.isModalOpen = false
            this.isRemoving = false
            this.selected = null
        },
        open() {
            this.isModalOpen = false
            this.add()
        },
        close() {
            this.isAdding = false
            this.isOpen = false
        }
    },
    computed: {
        isOptionsOpen() {
            return (this.isModalOpen && window.innerWidth < 500)
        }
    },
    components: {
        CFormInput,
        CFormTextarea,
        removeModal
    }
}
</script>