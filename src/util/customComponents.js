import app from '../app';
import Error from '@comp/Error.vue'
import Navbar from '@comp/Navbar.vue'
import Button from '@comp/Button.vue'
import Modal from '@comp/modals/Modal.vue'
import ModalPDF from '@comp/modals/ModalPDF.vue'
import ModalForm from '@comp/modals/ModalForm.vue'
import EmptyView from '@comp/EmptyView.vue'
import ModalRight from '@comp/modals/ModalRight.vue'
import ModalFull from '@comp/modals/ModalFull.vue'
import DropdownOptions from '@comp/DropdownOptions.vue'

app.component('Error', Error);
app.component('Button', Button);
app.component('Navbar', Navbar);
app.component('Modal', Modal);
app.component('ModalPDF', ModalPDF);
app.component('ModalForm', ModalForm);
app.component('ModalRight', ModalRight);
app.component('EmptyView', EmptyView);
app.component('ModalFull', ModalFull);
app.component('DropdownOptions', DropdownOptions);
