import VueComponent from '../common/component'
import cell from '../mixins/cell'

const currentYear = new Date().getFullYear()

VueComponent({
  externalClasses: [
    'custom-view-class',
    'custom-label-class',
    'custom-value-class'
  ],
  behaviors: [cell, 'jd://form-field'],
  relations: {
    '../cellGroup/index': {
      type: 'ancestor',
      linked (target) {
        this.parent = target
      },
      unlinked () {
        this.parent = null
      }
    }
  },
  props: {
    value: {
      type: [null, Number, Array]
    },
    type: {
      type: String,
      value: 'date'
    },
    label: String,
    labelWidth: String,
    useLabelSlot: Boolean,
    useDefaultSlot: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
    // 弹出层标题
    title: String,
    // 取消按钮文案
    cancelButtonText: {
      type: String,
      value: '取消'
    },
    // 确认按钮文案
    confirmButtonText: {
      type: String,
      value: '完成'
    },
    // 外部展示格式化函数
    displayFormat: {
      type: null,
      observer (fn) {
        if (getType(fn) !== 'function') {
          throw Error('The type of displayFormat must be Function')
        }
      }
    },
    beforeConfirm: {
      type: null,
      observer (fn) {
        if (getType(fn) !== 'function') {
          throw Error('The type of beforeConfirm must be Function')
        }
      }
    },
    alignRight: Boolean,
    error: Boolean,
    required: Boolean,
    size: String,
    closeOnClickModal: {
      type: Boolean,
      value: true
    },
    minDate: {
      type: Number,
      value: new Date(currentYear - 1, 0, 1).getTime()
    },
    maxDate: {
      type: Number,
      value: new Date(currentYear + 1, 11, 31).getTime()
    },
    firstDayOfWeek: {
      type: Number,
      value: 7
    }
  },
  data: {
    pickerShow: true,
    showValue: '',
  },
  methods: {
    showPicker () {
      const { disabled, readonly } = this.data

      if (disabled || readonly) return

      this.setData({
        pickerShow: true
      })
    },
    handlePickerClose () {
      this.setData({
        pickerShow: false
      })
    },
    onCancel () {},
    onConfirm () {},
    handleChange ({ detail: { value } }) {
      this.setData({
        value
      })
      this.$emit('change', {
        value
      })
    }
  }
})