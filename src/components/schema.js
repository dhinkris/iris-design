var baseIRTKDIR = '/Users/cnmc/IRTK/build/bin'
const command=[
    {
        "inputs": [
            {
                "command-line-flag": "--args",
                "name": "Args",
                "optional": true,
                "list": false,
                "command-line-key": "[ARGS]",
                "type": "String",
                "id": "input_args",
                "description": "A string. Additional parameters to the command."
            },
            {
                "command-line-flag": "--center",
                "name": "Center",
                "optional": true,
                "list": true,
                "command-line-key": "[CENTER]",
                "type": "Number",
                "id": "input_center",
                "description": "A list of at most 3 items which are an integer (int or long). Center of gravity in voxels."
            },
            {
                "command-line-flag": "--environ",
                "name": "Environ",
                "default-value": "{}",
                "optional": true,
                "list": false,
                "command-line-key": "[ENVIRON]",
                "type": "String",
                "id": "input_environ",
                "description": "A dictionary with keys which are a value of type 'str' and with values which are a value of type 'str'. Environment variables."
            },
            {
                "command-line-flag": "--frac",
                "name": "Frac",
                "optional": true,
                "list": false,
                "command-line-key": "[FRAC]",
                "type": "Number",
                "id": "input_frac",
                "description": "A float. Fractional intensity threshold."
            },
            {
                "command-line-flag": "--functional",
                "name": "Functional",
                "optional": true,
                "list": false,
                "command-line-key": "[FUNCTIONAL]",
                "type": "Boolean",
                "id": "input_functional",
                "description": "A boolean. Apply to 4d fmri data."
            },
            {
                "command-line-flag": "--ignore_exception",
                "name": "Ignore exception",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[IGNORE_EXCEPTION]",
                "type": "Boolean",
                "id": "input_ignore_exception",
                "description": "A boolean. Print an error message instead of throwing an exception in case the interface fails to run."
            },
            {
                "command-line-flag": "--in_file",
                "name": "In file",
                "optional": false,
                "list": false,
                "command-line-key": "[IN_FILE]",
                "type": "File",
                "id": "input_in_file",
                "description": "An existing file name. Input file to skull strip."
            },
            {
                "command-line-flag": "--mask",
                "name": "Mask",
                "optional": true,
                "list": false,
                "command-line-key": "[MASK]",
                "type": "Boolean",
                "id": "input_mask",
                "description": "A boolean. Create binary mask image."
            },
            {
                "command-line-flag": "--mesh",
                "name": "Mesh",
                "optional": true,
                "list": false,
                "command-line-key": "[MESH]",
                "type": "Boolean",
                "id": "input_mesh",
                "description": "A boolean. Generate a vtk mesh brain surface."
            },
            {
                "command-line-flag": "--no_output",
                "name": "No output",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_OUTPUT]",
                "type": "Boolean",
                "id": "input_no_output",
                "description": "A boolean. Don't generate segmented output."
            },
            {
                "command-line-flag": "--out_file",
                "name": "Out file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_FILE]",
                "type": "String",
                "id": "input_out_file",
                "description": "A file name. Name of output skull stripped image."
            },
            {
                "command-line-flag": "--outline",
                "name": "Outline",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTLINE]",
                "type": "Boolean",
                "id": "input_outline",
                "description": "A boolean. Create surface outline image."
            },
            {
                "command-line-flag": "--output_type",
                "name": "Output type",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_TYPE]",
                "type": "String",
                "id": "input_output_type",
                "description": "'nifti_pair' or 'nifti_pair_gz' or 'nifti_gz' or 'nifti'. Fsl output type."
            },
            {
                "command-line-flag": "--padding",
                "name": "Padding",
                "optional": true,
                "list": false,
                "command-line-key": "[PADDING]",
                "type": "Boolean",
                "id": "input_padding",
                "description": "A boolean. Improve bet if fov is very small in z (by temporarily padding end slices)."
            },
            {
                "command-line-flag": "--radius",
                "name": "Radius",
                "optional": true,
                "list": false,
                "command-line-key": "[RADIUS]",
                "type": "Number",
                "id": "input_radius",
                "description": "An integer (int or long). Head radius."
            },
            {
                "command-line-flag": "--reduce_bias",
                "name": "Reduce bias",
                "optional": true,
                "list": false,
                "command-line-key": "[REDUCE_BIAS]",
                "type": "Boolean",
                "id": "input_reduce_bias",
                "description": "A boolean. Bias field and neck cleanup."
            },
            {
                "command-line-flag": "--remove_eyes",
                "name": "Remove eyes",
                "optional": true,
                "list": false,
                "command-line-key": "[REMOVE_EYES]",
                "type": "Boolean",
                "id": "input_remove_eyes",
                "description": "A boolean. Eye & optic nerve cleanup (can be useful in siena)."
            },
            {
                "command-line-flag": "--robust",
                "name": "Robust",
                "optional": true,
                "list": false,
                "command-line-key": "[ROBUST]",
                "type": "Boolean",
                "id": "input_robust",
                "description": "A boolean. Robust brain centre estimation (iterates bet several times)."
            },
            {
                "command-line-flag": "--skull",
                "name": "Skull",
                "optional": true,
                "list": false,
                "command-line-key": "[SKULL]",
                "type": "Boolean",
                "id": "input_skull",
                "description": "A boolean. Create skull image."
            },
            {
                "command-line-flag": "--surfaces",
                "name": "Surfaces",
                "optional": true,
                "list": false,
                "command-line-key": "[SURFACES]",
                "type": "Boolean",
                "id": "input_surfaces",
                "description": "A boolean. Run bet2 and then betsurf to get additional skull and scalp surfaces (includes registrations)."
            },
            {
                "command-line-flag": "--t2_guided",
                "name": "T2 guided",
                "optional": true,
                "list": false,
                "command-line-key": "[T2_GUIDED]",
                "type": "String",
                "id": "input_t2_guided",
                "description": "A file name. As with creating surfaces, when also feeding in non-brain-extracted t2 (includes registrations)."
            },
            {
                "command-line-flag": "--terminal_output",
                "name": "Terminal output",
                "optional": true,
                "list": false,
                "command-line-key": "[TERMINAL_OUTPUT]",
                "type": "String",
                "id": "input_terminal_output",
                "description": "'stream' or 'allatonce' or 'file' or 'none'. Control terminal output: `stream` - displays to terminal immediately (default), `allatonce` - waits till command is finished to display output, `file` - writes output to file, `none` - output is ignored."
            },
            {
                "command-line-flag": "--threshold",
                "name": "Threshold",
                "optional": true,
                "list": false,
                "command-line-key": "[THRESHOLD]",
                "type": "Boolean",
                "id": "input_threshold",
                "description": "A boolean. Apply thresholding to segmented brain image and mask."
            },
            {
                "command-line-flag": "--vertical_gradient",
                "name": "Vertical gradient",
                "optional": true,
                "list": false,
                "command-line-key": "[VERTICAL_GRADIENT]",
                "type": "Number",
                "id": "input_vertical_gradient",
                "description": "A float. Vertical gradient in fractional intensity threshold (-1, 1)."
            }
        ],
        "name": "BET",
        "command-line": "nipype_cmd nipype.interfaces.fsl BET [ARGS] [CENTER] [ENVIRON] [FRAC] [FUNCTIONAL] [IGNORE_EXCEPTION] [IN_FILE] [MASK] [MESH] [NO_OUTPUT] [OUT_FILE] [OUTLINE] [OUTPUT_TYPE] [PADDING] [RADIUS] [REDUCE_BIAS] [REMOVE_EYES] [ROBUST] [SKULL] [SURFACES] [T2_GUIDED] [TERMINAL_OUTPUT] [THRESHOLD] [VERTICAL_GRADIENT] ",
        "tool-version": "5.0.6",
        "docker-index": "http://index.docker.io",
        "schema-version": "0.2-snapshot",
        "output_files": [
            {
                "path-template": "[OUT_FILE]_mask.nii.gz",
                "optional": true,
                "type": "File",
                "name": "Mask file",
                "id": "output_mask_file"
            },
            {
                "path-template": "[OUT_FILE]_mesh.vtk",
                "optional": true,
                "type": "File",
                "name": "Meshfile",
                "id": "output_meshfile"
            },
            {
                "path-template": "[OUT_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out file",
                "id": "output_out_file"
            },
            {
                "path-template": "[OUT_FILE]_overlay.nii.gz",
                "optional": true,
                "type": "File",
                "name": "Outline file",
                "id": "output_outline_file"
            }
        ],
        "docker-image": "glatard/nipype_fsl",
        "description": "BET, as implemented in Nipype (module: nipype.interfaces.fsl, interface: BET)."
    },
    {
        "inputs": [
            {
                "command-line-flag": "--angle_rep",
                "name": "Angle rep",
                "optional": true,
                "list": false,
                "command-line-key": "[ANGLE_REP]",
                "type": "String",
                "id": "input_angle_rep",
                "description": "'quaternion' or 'euler'. Representation of rotation angles."
            },
            {
                "command-line-flag": "--apply_isoxfm",
                "name": "Apply isoxfm",
                "optional": true,
                "list": false,
                "command-line-key": "[APPLY_ISOXFM]",
                "type": "Number",
                "id": "input_apply_isoxfm",
                "description": "A float. As applyxfm but forces isotropic resampling."
            },
            {
                "command-line-flag": "--apply_xfm",
                "name": "Apply xfm",
                "optional": true,
                "list": false,
                "command-line-key": "[APPLY_XFM]",
                "type": "Boolean",
                "id": "input_apply_xfm",
                "description": "A boolean. Apply transformation supplied by in_matrix_file."
            },
            {
                "command-line-flag": "--args",
                "name": "Args",
                "optional": true,
                "list": false,
                "command-line-key": "[ARGS]",
                "type": "String",
                "id": "input_args",
                "description": "A string. Additional parameters to the command."
            },
            {
                "command-line-flag": "--bbrslope",
                "name": "Bbrslope",
                "optional": true,
                "list": false,
                "command-line-key": "[BBRSLOPE]",
                "type": "Number",
                "id": "input_bbrslope",
                "description": "A float. Value of bbr slope."
            },
            {
                "command-line-flag": "--bbrtype",
                "name": "Bbrtype",
                "optional": true,
                "list": false,
                "command-line-key": "[BBRTYPE]",
                "type": "String",
                "id": "input_bbrtype",
                "description": "'signed' or 'global_abs' or 'local_abs'. Type of bbr cost function: signed [default], global_abs, local_abs."
            },
            {
                "command-line-flag": "--bgvalue",
                "name": "Bgvalue",
                "optional": true,
                "list": false,
                "command-line-key": "[BGVALUE]",
                "type": "Number",
                "id": "input_bgvalue",
                "description": "A float. Use specified background value for points outside fov."
            },
            {
                "command-line-flag": "--bins",
                "name": "Bins",
                "optional": true,
                "list": false,
                "command-line-key": "[BINS]",
                "type": "Number",
                "id": "input_bins",
                "description": "An integer (int or long). Number of histogram bins."
            },
            {
                "command-line-flag": "--coarse_search",
                "name": "Coarse search",
                "optional": true,
                "list": false,
                "command-line-key": "[COARSE_SEARCH]",
                "type": "Number",
                "id": "input_coarse_search",
                "description": "An integer (int or long). Coarse search delta angle."
            },
            {
                "command-line-flag": "--cost",
                "name": "Cost",
                "optional": true,
                "list": false,
                "command-line-key": "[COST]",
                "type": "String",
                "id": "input_cost",
                "description": "'mutualinfo' or 'corratio' or 'normcorr' or 'normmi' or 'leastsq' or 'labeldiff' or 'bbr'. Cost function."
            },
            {
                "command-line-flag": "--cost_func",
                "name": "Cost func",
                "optional": true,
                "list": false,
                "command-line-key": "[COST_FUNC]",
                "type": "String",
                "id": "input_cost_func",
                "description": "'mutualinfo' or 'corratio' or 'normcorr' or 'normmi' or 'leastsq' or 'labeldiff' or 'bbr'. Cost function."
            },
            {
                "command-line-flag": "--datatype",
                "name": "Datatype",
                "optional": true,
                "list": false,
                "command-line-key": "[DATATYPE]",
                "type": "String",
                "id": "input_datatype",
                "description": "'char' or 'short' or 'int' or 'float' or 'double'. Force output data type."
            },
            {
                "command-line-flag": "--display_init",
                "name": "Display init",
                "optional": true,
                "list": false,
                "command-line-key": "[DISPLAY_INIT]",
                "type": "Boolean",
                "id": "input_display_init",
                "description": "A boolean. Display initial matrix."
            },
            {
                "command-line-flag": "--dof",
                "name": "Dof",
                "optional": true,
                "list": false,
                "command-line-key": "[DOF]",
                "type": "Number",
                "id": "input_dof",
                "description": "An integer (int or long). Number of transform degrees of freedom."
            },
            {
                "command-line-flag": "--echospacing",
                "name": "Echospacing",
                "optional": true,
                "list": false,
                "command-line-key": "[ECHOSPACING]",
                "type": "Number",
                "id": "input_echospacing",
                "description": "A float. Value of epi echo spacing - units of seconds."
            },
            {
                "command-line-flag": "--environ",
                "name": "Environ",
                "default-value": "{}",
                "optional": true,
                "list": false,
                "command-line-key": "[ENVIRON]",
                "type": "String",
                "id": "input_environ",
                "description": "A dictionary with keys which are a value of type 'str' and with values which are a value of type 'str'. Environment variables."
            },
            {
                "command-line-flag": "--fieldmap",
                "name": "Fieldmap",
                "optional": true,
                "list": false,
                "command-line-key": "[FIELDMAP]",
                "type": "String",
                "id": "input_fieldmap",
                "description": "A file name. Fieldmap image in rads/s - must be already registered to the reference image."
            },
            {
                "command-line-flag": "--fieldmapmask",
                "name": "Fieldmapmask",
                "optional": true,
                "list": false,
                "command-line-key": "[FIELDMAPMASK]",
                "type": "String",
                "id": "input_fieldmapmask",
                "description": "A file name. Mask for fieldmap image."
            },
            {
                "command-line-flag": "--fine_search",
                "name": "Fine search",
                "optional": true,
                "list": false,
                "command-line-key": "[FINE_SEARCH]",
                "type": "Number",
                "id": "input_fine_search",
                "description": "An integer (int or long). Fine search delta angle."
            },
            {
                "command-line-flag": "--force_scaling",
                "name": "Force scaling",
                "optional": true,
                "list": false,
                "command-line-key": "[FORCE_SCALING]",
                "type": "Boolean",
                "id": "input_force_scaling",
                "description": "A boolean. Force rescaling even for low-res images."
            },
            {
                "command-line-flag": "--ignore_exception",
                "name": "Ignore exception",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[IGNORE_EXCEPTION]",
                "type": "Boolean",
                "id": "input_ignore_exception",
                "description": "A boolean. Print an error message instead of throwing an exception in case the interface fails to run."
            },
            {
                "command-line-flag": "--in_file",
                "name": "In file",
                "optional": false,
                "list": false,
                "command-line-key": "[IN_FILE]",
                "type": "File",
                "id": "input_in_file",
                "description": "An existing file name. Input file."
            },
            {
                "command-line-flag": "--in_matrix_file",
                "name": "In matrix file",
                "optional": true,
                "list": false,
                "command-line-key": "[IN_MATRIX_FILE]",
                "type": "String",
                "id": "input_in_matrix_file",
                "description": "A file name. Input 4x4 affine matrix."
            },
            {
                "command-line-flag": "--in_weight",
                "name": "In weight",
                "optional": true,
                "list": false,
                "command-line-key": "[IN_WEIGHT]",
                "type": "File",
                "id": "input_in_weight",
                "description": "An existing file name. File for input weighting volume."
            },
            {
                "command-line-flag": "--interp",
                "name": "Interp",
                "optional": true,
                "list": false,
                "command-line-key": "[INTERP]",
                "type": "String",
                "id": "input_interp",
                "description": "'trilinear' or 'nearestneighbour' or 'sinc' or 'spline'. Final interpolation method used in reslicing."
            },
            {
                "command-line-flag": "--min_sampling",
                "name": "Min sampling",
                "optional": true,
                "list": false,
                "command-line-key": "[MIN_SAMPLING]",
                "type": "Number",
                "id": "input_min_sampling",
                "description": "A float. Set minimum voxel dimension for sampling."
            },
            {
                "command-line-flag": "--no_clamp",
                "name": "No clamp",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_CLAMP]",
                "type": "Boolean",
                "id": "input_no_clamp",
                "description": "A boolean. Do not use intensity clamping."
            },
            {
                "command-line-flag": "--no_resample",
                "name": "No resample",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_RESAMPLE]",
                "type": "Boolean",
                "id": "input_no_resample",
                "description": "A boolean. Do not change input sampling."
            },
            {
                "command-line-flag": "--no_resample_blur",
                "name": "No resample blur",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_RESAMPLE_BLUR]",
                "type": "Boolean",
                "id": "input_no_resample_blur",
                "description": "A boolean. Do not use blurring on downsampling."
            },
            {
                "command-line-flag": "--no_search",
                "name": "No search",
                "optional": true,
                "list": false,
                "command-line-key": "[NO_SEARCH]",
                "type": "Boolean",
                "id": "input_no_search",
                "description": "A boolean. Set all angular searches to ranges 0 to 0."
            },
            {
                "command-line-flag": "--out_file",
                "name": "Out file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_FILE]",
                "type": "String",
                "id": "input_out_file",
                "description": "A file name. Registered output file."
            },
            {
                "command-line-flag": "--out_log",
                "name": "Out log",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_LOG]",
                "type": "String",
                "id": "input_out_log",
                "description": "A file name. Output log."
            },
            {
                "command-line-flag": "--out_matrix_file",
                "name": "Out matrix file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_MATRIX_FILE]",
                "type": "String",
                "id": "input_out_matrix_file",
                "description": "A file name. Output affine matrix in 4x4 asciii format."
            },
            {
                "command-line-flag": "--output_type",
                "name": "Output type",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_TYPE]",
                "type": "String",
                "id": "input_output_type",
                "description": "'nifti_pair' or 'nifti_pair_gz' or 'nifti_gz' or 'nifti'. Fsl output type."
            },
            {
                "command-line-flag": "--padding_size",
                "name": "Padding size",
                "optional": true,
                "list": false,
                "command-line-key": "[PADDING_SIZE]",
                "type": "Number",
                "id": "input_padding_size",
                "description": "An integer (int or long). For applyxfm: interpolates outside image by size."
            },
            {
                "command-line-flag": "--pedir",
                "name": "Pedir",
                "optional": true,
                "list": false,
                "command-line-key": "[PEDIR]",
                "type": "Number",
                "id": "input_pedir",
                "description": "An integer (int or long). Phase encode direction of epi - 1/2/3=x/y/z & -1/-2/-3=-x/-y/-z."
            },
            {
                "command-line-flag": "--ref_weight",
                "name": "Ref weight",
                "optional": true,
                "list": false,
                "command-line-key": "[REF_WEIGHT]",
                "type": "File",
                "id": "input_ref_weight",
                "description": "An existing file name. File for reference weighting volume."
            },
            {
                "command-line-flag": "--reference",
                "name": "Reference",
                "optional": false,
                "list": false,
                "command-line-key": "[REFERENCE]",
                "type": "File",
                "id": "input_reference",
                "description": "An existing file name. Reference file."
            },
            {
                "command-line-flag": "--rigid2D",
                "name": "Rigid2d",
                "optional": true,
                "list": false,
                "command-line-key": "[RIGID2D]",
                "type": "Boolean",
                "id": "input_rigid2D",
                "description": "A boolean. Use 2d rigid body mode - ignores dof."
            },
            {
                "command-line-flag": "--save_log",
                "name": "Save log",
                "optional": true,
                "list": false,
                "command-line-key": "[SAVE_LOG]",
                "type": "Boolean",
                "id": "input_save_log",
                "description": "A boolean. Save to log file."
            },
            {
                "command-line-flag": "--schedule",
                "name": "Schedule",
                "optional": true,
                "list": false,
                "command-line-key": "[SCHEDULE]",
                "type": "Boolean",
                "id": "input_schedule",
                "description": "An existing file name. Replaces default schedule."
            },
            {
                "command-line-flag": "--searchr_x",
                "name": "Searchr x",
                "optional": true,
                "list": true,
                "command-line-key": "[SEARCHR_X]",
                "type": "Number",
                "id": "input_searchr_x",
                "description": "A list of from 2 to 2 items which are an integer (int or long). Search angles along x-axis, in degrees."
            },
            {
                "command-line-flag": "--searchr_y",
                "name": "Searchr y",
                "optional": true,
                "list": true,
                "command-line-key": "[SEARCHR_Y]",
                "type": "Number",
                "id": "input_searchr_y",
                "description": "A list of from 2 to 2 items which are an integer (int or long). Search angles along y-axis, in degrees."
            },
            {
                "command-line-flag": "--searchr_z",
                "name": "Searchr z",
                "optional": true,
                "list": true,
                "command-line-key": "[SEARCHR_Z]",
                "type": "Number",
                "id": "input_searchr_z",
                "description": "A list of from 2 to 2 items which are an integer (int or long). Search angles along z-axis, in degrees."
            },
            {
                "command-line-flag": "--sinc_width",
                "name": "Sinc width",
                "optional": true,
                "list": false,
                "command-line-key": "[SINC_WIDTH]",
                "type": "Number",
                "id": "input_sinc_width",
                "description": "An integer (int or long). Full-width in voxels."
            },
            {
                "command-line-flag": "--sinc_window",
                "name": "Sinc window",
                "optional": true,
                "list": false,
                "command-line-key": "[SINC_WINDOW]",
                "type": "String",
                "id": "input_sinc_window",
                "description": "'rectangular' or 'hanning' or 'blackman'. Sinc window."
            },
            {
                "command-line-flag": "--terminal_output",
                "name": "Terminal output",
                "optional": true,
                "list": false,
                "command-line-key": "[TERMINAL_OUTPUT]",
                "type": "String",
                "id": "input_terminal_output",
                "description": "'stream' or 'allatonce' or 'file' or 'none'. Control terminal output: `stream` - displays to terminal immediately (default), `allatonce` - waits till command is finished to display output, `file` - writes output to file, `none` - output is ignored."
            },
            {
                "command-line-flag": "--uses_qform",
                "name": "Uses qform",
                "optional": true,
                "list": false,
                "command-line-key": "[USES_QFORM]",
                "type": "Boolean",
                "id": "input_uses_qform",
                "description": "A boolean. Initialize using sform or qform."
            },
            {
                "command-line-flag": "--verbose",
                "name": "Verbose",
                "optional": true,
                "list": false,
                "command-line-key": "[VERBOSE]",
                "type": "Number",
                "id": "input_verbose",
                "description": "An integer (int or long). Verbose mode, 0 is least."
            },
            {
                "command-line-flag": "--wm_seg",
                "name": "Wm seg",
                "optional": true,
                "list": false,
                "command-line-key": "[WM_SEG]",
                "type": "String",
                "id": "input_wm_seg",
                "description": "A file name. White matter segmentation volume needed by bbr cost function."
            },
            {
                "command-line-flag": "--wmcoords",
                "name": "Wmcoords",
                "optional": true,
                "list": false,
                "command-line-key": "[WMCOORDS]",
                "type": "String",
                "id": "input_wmcoords",
                "description": "A file name. White matter boundary coordinates for bbr cost function."
            },
            {
                "command-line-flag": "--wmnorms",
                "name": "Wmnorms",
                "optional": true,
                "list": false,
                "command-line-key": "[WMNORMS]",
                "type": "String",
                "id": "input_wmnorms",
                "description": "A file name. White matter boundary normals for bbr cost function."
            }
        ],
        "name": "FLIRT",
        "command-line": "nipype_cmd nipype.interfaces.fsl FLIRT [ANGLE_REP] [APPLY_ISOXFM] [APPLY_XFM] [ARGS] [BBRSLOPE] [BBRTYPE] [BGVALUE] [BINS] [COARSE_SEARCH] [COST] [COST_FUNC] [DATATYPE] [DISPLAY_INIT] [DOF] [ECHOSPACING] [ENVIRON] [FIELDMAP] [FIELDMAPMASK] [FINE_SEARCH] [FORCE_SCALING] [IGNORE_EXCEPTION] [IN_FILE] [IN_MATRIX_FILE] [IN_WEIGHT] [INTERP] [MIN_SAMPLING] [NO_CLAMP] [NO_RESAMPLE] [NO_RESAMPLE_BLUR] [NO_SEARCH] [OUT_FILE] [OUT_LOG] [OUT_MATRIX_FILE] [OUTPUT_TYPE] [PADDING_SIZE] [PEDIR] [REF_WEIGHT] [REFERENCE] [RIGID2D] [SAVE_LOG] [SCHEDULE] [SEARCHR_X] [SEARCHR_Y] [SEARCHR_Z] [SINC_WIDTH] [SINC_WINDOW] [TERMINAL_OUTPUT] [USES_QFORM] [VERBOSE] [WM_SEG] [WMCOORDS] [WMNORMS] ",
        "tool-version": "5.0.6",
        "docker-index": "http://index.docker.io",
        "schema-version": "0.2-snapshot",
        "output_files": [
            {
                "path-template": "[OUT_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out file",
                "id": "output_out_file"
            },
            {
                "path-template": "[OUT_LOG]",
                "optional": true,
                "type": "File",
                "name": "Out log",
                "id": "output_out_log"
            },
            {
                "path-template": "[OUT_MATRIX_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out matrix file",
                "id": "output_out_matrix_file"
            }
        ],
        "docker-image": "glatard/nipype_fsl",
        "description": "FLIRT, as implemented in Nipype (module: nipype.interfaces.fsl, interface: FLIRT)."
    },
    {
        "inputs": [
            {
                "command-line-flag": "--args",
                "name": "Args",
                "optional": true,
                "list": false,
                "command-line-key": "[ARGS]",
                "type": "String",
                "id": "input_args",
                "description": "A string. Additional parameters to the command."
            },
            {
                "command-line-flag": "--concat_xfm",
                "name": "Concat xfm",
                "optional": true,
                "list": false,
                "command-line-key": "[CONCAT_XFM]",
                "type": "Boolean",
                "id": "input_concat_xfm",
                "description": "A boolean. Write joint transformation of two input matrices."
            },
            {
                "command-line-flag": "--environ",
                "name": "Environ",
                "default-value": "{}",
                "optional": true,
                "list": false,
                "command-line-key": "[ENVIRON]",
                "type": "String",
                "id": "input_environ",
                "description": "A dictionary with keys which are a value of type 'str' and with values which are a value of type 'str'. Environment variables."
            },
            {
                "command-line-flag": "--fix_scale_skew",
                "name": "Fix scale skew",
                "optional": true,
                "list": false,
                "command-line-key": "[FIX_SCALE_SKEW]",
                "type": "Boolean",
                "id": "input_fix_scale_skew",
                "description": "A boolean. Use secondary matrix to fix scale and skew."
            },
            {
                "command-line-flag": "--ignore_exception",
                "name": "Ignore exception",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[IGNORE_EXCEPTION]",
                "type": "Boolean",
                "id": "input_ignore_exception",
                "description": "A boolean. Print an error message instead of throwing an exception in case the interface fails to run."
            },
            {
                "command-line-flag": "--in_file",
                "name": "In file",
                "optional": false,
                "list": false,
                "command-line-key": "[IN_FILE]",
                "type": "File",
                "id": "input_in_file",
                "description": "An existing file name. Input transformation matrix."
            },
            {
                "command-line-flag": "--in_file2",
                "name": "In file2",
                "optional": true,
                "list": false,
                "command-line-key": "[IN_FILE2]",
                "type": "File",
                "id": "input_in_file2",
                "description": "An existing file name. Second input matrix (for use with fix_scale_skew or concat_xfm."
            },
            {
                "command-line-flag": "--invert_xfm",
                "name": "Invert xfm",
                "optional": true,
                "list": false,
                "command-line-key": "[INVERT_XFM]",
                "type": "Boolean",
                "id": "input_invert_xfm",
                "description": "A boolean. Invert input transformation."
            },
            {
                "command-line-flag": "--out_file",
                "name": "Out file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_FILE]",
                "type": "String",
                "id": "input_out_file",
                "description": "A file name. Final transformation matrix."
            },
            {
                "command-line-flag": "--output_type",
                "name": "Output type",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_TYPE]",
                "type": "String",
                "id": "input_output_type",
                "description": "'nifti_pair' or 'nifti_pair_gz' or 'nifti_gz' or 'nifti'. Fsl output type."
            },
            {
                "command-line-flag": "--terminal_output",
                "name": "Terminal output",
                "optional": true,
                "list": false,
                "command-line-key": "[TERMINAL_OUTPUT]",
                "type": "String",
                "id": "input_terminal_output",
                "description": "'stream' or 'allatonce' or 'file' or 'none'. Control terminal output: `stream` - displays to terminal immediately (default), `allatonce` - waits till command is finished to display output, `file` - writes output to file, `none` - output is ignored."
            }
        ],
        "name": "ConvertXFM",
        "command-line": "nipype_cmd nipype.interfaces.fsl ConvertXFM [ARGS] [CONCAT_XFM] [ENVIRON] [FIX_SCALE_SKEW] [IGNORE_EXCEPTION] [IN_FILE] [IN_FILE2] [INVERT_XFM] [OUT_FILE] [OUTPUT_TYPE] [TERMINAL_OUTPUT] ",
        "tool-version": "5.0.6",
        "docker-index": "http://index.docker.io",
        "schema-version": "0.2-snapshot",
        "output_files": [
            {
                "path-template": "[OUT_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out file",
                "id": "output_out_file"
            }
        ],
        "docker-image": "glatard/nipype_fsl",
        "description": "ConvertXFM, as implemented in Nipype (module: nipype.interfaces.fsl, interface: ConvertXFM)."
    },
    {
        "inputs": [
            {
                "command-line-flag": "--args",
                "name": "Args",
                "optional": true,
                "list": false,
                "command-line-key": "[ARGS]",
                "type": "String",
                "id": "input_args",
                "description": "A string. Additional parameters to the command."
            },
            {
                "command-line-flag": "--environ",
                "name": "Environ",
                "default-value": "{}",
                "optional": true,
                "list": false,
                "command-line-key": "[ENVIRON]",
                "type": "String",
                "id": "input_environ",
                "description": "A dictionary with keys which are a value of type 'str' and with values which are a value of type 'str'. Environment variables."
            },
            {
                "command-line-flag": "--ignore_exception",
                "name": "Ignore exception",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[IGNORE_EXCEPTION]",
                "type": "Boolean",
                "id": "input_ignore_exception",
                "description": "A boolean. Print an error message instead of throwing an exception in case the interface fails to run."
            },
            {
                "command-line-flag": "--in_file",
                "name": "In file",
                "optional": false,
                "list": false,
                "command-line-key": "[IN_FILE]",
                "type": "File",
                "id": "input_in_file",
                "description": "An existing file name. Image to operate on."
            },
            {
                "command-line-flag": "--internal_datatype",
                "name": "Internal datatype",
                "optional": true,
                "list": false,
                "command-line-key": "[INTERNAL_DATATYPE]",
                "type": "String",
                "id": "input_internal_datatype",
                "description": "'float' or 'char' or 'int' or 'short' or 'double' or 'input'. Datatype to use for calculations (default is float)."
            },
            {
                "command-line-flag": "--kernel_file",
                "name": "Kernel file",
                "optional": true,
                "list": false,
                "command-line-key": "[KERNEL_FILE]",
                "type": "File",
                "id": "input_kernel_file",
                "description": "An existing file name. Use external file for kernel."
            },
            {
                "command-line-flag": "--kernel_shape",
                "name": "Kernel shape",
                "optional": true,
                "list": false,
                "command-line-key": "[KERNEL_SHAPE]",
                "type": "String",
                "id": "input_kernel_shape",
                "description": "'3d' or '2d' or 'box' or 'boxv' or 'gauss' or 'sphere' or 'file'. Kernel shape to use."
            },
            {
                "command-line-flag": "--kernel_size",
                "name": "Kernel size",
                "optional": true,
                "list": false,
                "command-line-key": "[KERNEL_SIZE]",
                "type": "Number",
                "id": "input_kernel_size",
                "description": "A float. Kernel size - voxels for box/boxv, mm for sphere, mm sigma for gauss."
            },
            {
                "command-line-flag": "--minimum_filter",
                "name": "Minimum filter",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[MINIMUM_FILTER]",
                "type": "Boolean",
                "id": "input_minimum_filter",
                "description": "A boolean. If true, minimum filter rather than erosion by zeroing-out."
            },
            {
                "command-line-flag": "--nan2zeros",
                "name": "Nan2zeros",
                "optional": true,
                "list": false,
                "command-line-key": "[NAN2ZEROS]",
                "type": "Boolean",
                "id": "input_nan2zeros",
                "description": "A boolean. Change nans to zeros before doing anything."
            },
            {
                "command-line-flag": "--out_file",
                "name": "Out file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_FILE]",
                "type": "String",
                "id": "input_out_file",
                "description": "A file name. Image to write."
            },
            {
                "command-line-flag": "--output_datatype",
                "name": "Output datatype",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_DATATYPE]",
                "type": "String",
                "id": "input_output_datatype",
                "description": "'float' or 'char' or 'int' or 'short' or 'double' or 'input'. Datatype to use for output (default uses input type)."
            },
            {
                "command-line-flag": "--output_type",
                "name": "Output type",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_TYPE]",
                "type": "String",
                "id": "input_output_type",
                "description": "'nifti_pair' or 'nifti_pair_gz' or 'nifti_gz' or 'nifti'. Fsl output type."
            },
            {
                "command-line-flag": "--terminal_output",
                "name": "Terminal output",
                "optional": true,
                "list": false,
                "command-line-key": "[TERMINAL_OUTPUT]",
                "type": "String",
                "id": "input_terminal_output",
                "description": "'stream' or 'allatonce' or 'file' or 'none'. Control terminal output: `stream` - displays to terminal immediately (default), `allatonce` - waits till command is finished to display output, `file` - writes output to file, `none` - output is ignored."
            }
        ],
        "name": "ErodeImage",
        "command-line": "nipype_cmd nipype.interfaces.fsl ErodeImage [ARGS] [ENVIRON] [IGNORE_EXCEPTION] [IN_FILE] [INTERNAL_DATATYPE] [KERNEL_FILE] [KERNEL_SHAPE] [KERNEL_SIZE] [MINIMUM_FILTER] [NAN2ZEROS] [OUT_FILE] [OUTPUT_DATATYPE] [OUTPUT_TYPE] [TERMINAL_OUTPUT] ",
        "tool-version": "5.0.6",
        "docker-index": "http://index.docker.io",
        "schema-version": "0.2-snapshot",
        "output_files": [
            {
                "path-template": "[OUT_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out file",
                "id": "output_out_file"
            }
        ],
        "docker-image": "glatard/nipype_fsl",
        "description": "ErodeImage, as implemented in Nipype (module: nipype.interfaces.fsl, interface: ErodeImage)."
    },
    {
        "inputs": [
            {
                "command-line-flag": "--args",
                "name": "Args",
                "optional": true,
                "list": false,
                "command-line-key": "[ARGS]",
                "type": "String",
                "id": "input_args",
                "description": "A string. Additional parameters to the command."
            },
            {
                "command-line-flag": "--environ",
                "name": "Environ",
                "default-value": "{}",
                "optional": true,
                "list": false,
                "command-line-key": "[ENVIRON]",
                "type": "String",
                "id": "input_environ",
                "description": "A dictionary with keys which are a value of type 'str' and with values which are a value of type 'str'. Environment variables."
            },
            {
                "command-line-flag": "--ignore_exception",
                "name": "Ignore exception",
                "default-value": "False",
                "optional": true,
                "list": false,
                "command-line-key": "[IGNORE_EXCEPTION]",
                "type": "Boolean",
                "id": "input_ignore_exception",
                "description": "A boolean. Print an error message instead of throwing an exception in case the interface fails to run."
            },
            {
                "command-line-flag": "--in_file",
                "name": "In file",
                "optional": false,
                "list": false,
                "command-line-key": "[IN_FILE]",
                "type": "File",
                "id": "input_in_file",
                "description": "An existing file name. Image to operate on."
            },
            {
                "command-line-flag": "--internal_datatype",
                "name": "Internal datatype",
                "optional": true,
                "list": false,
                "command-line-key": "[INTERNAL_DATATYPE]",
                "type": "String",
                "id": "input_internal_datatype",
                "description": "'float' or 'char' or 'int' or 'short' or 'double' or 'input'. Datatype to use for calculations (default is float)."
            },
            {
                "command-line-flag": "--kernel_file",
                "name": "Kernel file",
                "optional": true,
                "list": false,
                "command-line-key": "[KERNEL_FILE]",
                "type": "File",
                "id": "input_kernel_file",
                "description": "An existing file name. Use external file for kernel."
            },
            {
                "command-line-flag": "--kernel_shape",
                "name": "Kernel shape",
                "optional": true,
                "list": false,
                "command-line-key": "[KERNEL_SHAPE]",
                "type": "String",
                "id": "input_kernel_shape",
                "description": "'3d' or '2d' or 'box' or 'boxv' or 'gauss' or 'sphere' or 'file'. Kernel shape to use."
            },
            {
                "command-line-flag": "--kernel_size",
                "name": "Kernel size",
                "optional": true,
                "list": false,
                "command-line-key": "[KERNEL_SIZE]",
                "type": "Number",
                "id": "input_kernel_size",
                "description": "A float. Kernel size - voxels for box/boxv, mm for sphere, mm sigma for gauss."
            },
            {
                "command-line-flag": "--nan2zeros",
                "name": "Nan2zeros",
                "optional": true,
                "list": false,
                "command-line-key": "[NAN2ZEROS]",
                "type": "Boolean",
                "id": "input_nan2zeros",
                "description": "A boolean. Change nans to zeros before doing anything."
            },
            {
                "command-line-flag": "--operation",
                "name": "Operation",
                "optional": false,
                "list": false,
                "command-line-key": "[OPERATION]",
                "type": "String",
                "id": "input_operation",
                "description": "'mean' or 'modal' or 'max'. Filtering operation to perfoem in dilation."
            },
            {
                "command-line-flag": "--out_file",
                "name": "Out file",
                "optional": true,
                "list": false,
                "command-line-key": "[OUT_FILE]",
                "type": "String",
                "id": "input_out_file",
                "description": "A file name. Image to write."
            },
            {
                "command-line-flag": "--output_datatype",
                "name": "Output datatype",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_DATATYPE]",
                "type": "String",
                "id": "input_output_datatype",
                "description": "'float' or 'char' or 'int' or 'short' or 'double' or 'input'. Datatype to use for output (default uses input type)."
            },
            {
                "command-line-flag": "--output_type",
                "name": "Output type",
                "optional": true,
                "list": false,
                "command-line-key": "[OUTPUT_TYPE]",
                "type": "String",
                "id": "input_output_type",
                "description": "'nifti_pair' or 'nifti_pair_gz' or 'nifti_gz' or 'nifti'. Fsl output type."
            },
            {
                "command-line-flag": "--terminal_output",
                "name": "Terminal output",
                "optional": true,
                "list": false,
                "command-line-key": "[TERMINAL_OUTPUT]",
                "type": "String",
                "id": "input_terminal_output",
                "description": "'stream' or 'allatonce' or 'file' or 'none'. Control terminal output: `stream` - displays to terminal immediately (default), `allatonce` - waits till command is finished to display output, `file` - writes output to file, `none` - output is ignored."
            }
        ],
        "name": "DilateImage",
        "command-line": "nipype_cmd nipype.interfaces.fsl DilateImage [ARGS] [ENVIRON] [IGNORE_EXCEPTION] [IN_FILE] [INTERNAL_DATATYPE] [KERNEL_FILE] [KERNEL_SHAPE] [KERNEL_SIZE] [NAN2ZEROS] [OPERATION] [OUT_FILE] [OUTPUT_DATATYPE] [OUTPUT_TYPE] [TERMINAL_OUTPUT] ",
        "tool-version": "5.0.6",
        "docker-index": "http://index.docker.io",
        "schema-version": "0.2-snapshot",
        "output_files": [
            {
                "path-template": "[OUT_FILE]",
                "optional": true,
                "type": "File",
                "name": "Out file",
                "id": "output_out_file"
            }
        ],
        "docker-image": "glatard/nipype_fsl",
        "description": "DilateImage, as implemented in Nipype (module: nipype.interfaces.fsl, interface: DilateImage)."
    }
]

export default command

