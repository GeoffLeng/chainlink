use errno::{set_errno, Errno};
use libc;
use sgx_types::*;
use utils::cstr_len;

use use_enclave;

extern "C" {
    fn sgx_quote(
        eid: sgx_enclave_id_t,
        retval: *mut sgx_status_t,
        input: *const u8,
        input_len: usize,
        result_ptr: *mut u8,
        result_capacity: usize,
        result_len: *mut usize,
    ) -> sgx_status_t;
}

#[no_mangle]
pub extern "C" fn quote(
    input: *const libc::c_char,
    result_ptr: *mut libc::c_char,
    result_capacity: usize,
    result_len: *mut usize,
) {
    use_enclave(|enclave_id| {
        let mut retval = sgx_status_t::SGX_SUCCESS;
        let result = unsafe {
            sgx_quote(
                enclave_id,
                &mut retval,
                input as *const u8,
                cstr_len(input),
                result_ptr as *mut u8,
                result_capacity,
                result_len as *mut usize,
            )
        };

        set_errno(Errno(0));
        match result {
            sgx_status_t::SGX_SUCCESS => {}
            _ => {
                set_errno(Errno(result as i32));
                return;
            }
        }

        match retval {
            sgx_status_t::SGX_SUCCESS => {}
            _ => {
                set_errno(Errno(result as i32));
            }
        }
    });
}
