export default function pipeline(id, scan, ga){
    return {
        "commandsToExecute":[
            {
                "execplt":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineGPU.sh",
                "command":"/home/dhinesh/WebstormProjects/iris_bash_scripts/brain_detection/detectBrain /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/kk/fetal_recon_kainz/fetus_0"+id+"/scan_0"+scan+"/files/kainz/fetus_0"+id+"_*axbrain2mmssfse*_mr_????_phase_00.nii.gz ~/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/",
                "output_file":"/home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/localizedMask.nii.gz",
                "name":"brainlocalization",
                "dependency": "false"
            },
            {
                "execplt":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineGPU.sh",
                "command":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runsvr.sh /cm/shared/apps/fetalReconstruction/bin/SVRreconstructionGPU -o /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon.nii.gz -i /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/kk/fetal_recon_kainz/fetus_0"+id+"/scan_0"+scan+"/files/kainz/fetus_0"+id+"_*brain2mmssfse*_mr_????_phase_0?.nii.gz -m  /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/localizedMask.nii.gz --resolution 1.00",
                "output_file":"/home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon.nii.gz",
                "name":"superresolutionreconstruction",
                "dependency":"brainlocalization"
            },
            {
                "execplt":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineCPU.sh",
                "command":"/home/dhinesh/WebstormProjects/iris_bash_scripts/reorient.sh /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon.nii.gz /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon_transformed.nii.gz -dofin /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/kk/fetal_recon_kainz/fetus_0"+id+"/scan_0"+scan+"/files/kainz/fetus_0"+id+"_*.dof -target /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/adrian/fetal_recon/template_landmarks/template-"+ga+".nii.gz -linear",
                "output_file":"/home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon_transformed.nii.gz",
                "name":"brainreorientation",
                "dependency":"superresolutionreconstruction"
            },
            {
                "execplt":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineGPU.sh",
                "command":"/home/dhinesh/Desktop/brain_segmentation/fetal_whole_brain_seg/segmentbrain/fetalsegmentation_v2.sh /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon_transformed.nii.gz /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/",
                "output_file":"/home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon_transformed_brain_extracted.nii.gz",
                "name":"wholebrainextraction",
                "dependency":"brainreorientation"
            },
            {
                "execplt":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineGPU.sh",
                "command":"/data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/dhinesh/dl_segmentation/fetal_brain_segmentation/fetal_brain_segmentation.sh /home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon_transformed_brain_extracted.nii.gz ~/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/ config_34ventricle.json",
                "output_file":"/home/dhinesh/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_0"+id+"_scan_0"+scan+"_recon_transformed_brain_extracted_unet.nii.gz",
                "name":"fetalbrainsegmentation",
                "dependency":"wholebrainextraction"
            }
        ]
    }
}

// let data1= {
//     "commandsToExecute":[
//         {
//             "execplt":"/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineCPU.sh",
//             "command":"~/WebstormProjects/iris_bash_scripts/reorient.sh /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/dhinesh/test_processing/fetus_02184/scan_0"+scan+"/files/files/fetus_02184_scan_0"+scan+"_recon.nii ~/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/fetus_02184_scan_0"+scan+"_recon_transformed.nii.gz -dofin /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/dhinesh/test_processing/fetus_02184/scan_0"+scan+"/files/files/fetus_02184_scan_0"+scan+"_recon_d.dof -target /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/adrian/fetal_recon/template_landmarks/template-30.nii.gz -linear",
//             "name":"brainreorientation",
//             "dependency":"superresolutionreconstruction"
//         },
//         {
//             "execplt": "/home/dhinesh/WebstormProjects/iris_bash_scripts/runPipelineGPU.sh",
//             "command": "/home/dhinesh/Desktop/brain_segmentation/fetal_whole_brain_seg/segmentbrain/fetalsegmentation_v2.sh /data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/dhinesh/test_processing/fetus_02184/scan_0"+scan+"/files/files/fetus_02184_scan_0"+scan+"_recon_transformed.nii.gz ~/iris-folder-test/2dec252f-f76d-43ad-8c9c-6cc89a2e0412/workdir/",
//             "name": "wholebrainextraction",
//             "dependency": "brainreorientation"
//         }
//     ]
// }

// export default data;