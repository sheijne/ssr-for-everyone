import { ref, unref, useSSRContext, createSSRApp } from "vue";
import { ssrInterpolate, renderToString } from "vue/server-renderer";
import { c as counter } from "../assets/counter-BwDwepJE.js";
const _sfc_main = {
  __name: "Counter",
  __ssrInlineRender: true,
  setup(__props) {
    const count = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><h2>Vue count: ${ssrInterpolate(count.value)}</h2><h3>Shared count: ${ssrInterpolate(unref(counter).count)}</h3><button>+</button><button>-</button><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/islands/counter-vue/Counter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
function render() {
  const app = createSSRApp(_sfc_main);
  return renderToString(app);
}
export {
  render
};
