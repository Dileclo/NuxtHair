import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'                // базовая тема
// можно выбрать тему: 'flatpickr/dist/themes/material_blue.css'

import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'

// глобально русская локаль
flatpickr.localize(Russian)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('FlatPickr', FlatPickr)
})