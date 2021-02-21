export default {
    namespaced: true,
    state: {
        snackbar: {
            visible: false,
            text: null,
            timeout: 6000,
            multiline: false,
            color: 'info'
        }
    },
    mutations: {
        showSnackbar(state, payload) {
            state.snackbar.text = payload.text;
            state.snackbar.multiline = (payload.text.length > 50);

            if (payload.multiline) {
                state.snackbar.multiline = payload.multiline;
            }

            if (payload.timeout) {
                state.snackbar.timeout = payload.timeout;
            }
            state.snackbar.color = payload.success === true ? 'success' : 'error';
            state.snackbar.visible = true;
        },
        closeSnackbar(state) {
            state.snackbar.visible = false;
            state.snackbar.multiline = false;
            state.snackbar.timeout = 6000;
            state.snackbar.text = null;
            state.snackbar.color = 'info';
        },
    }
}