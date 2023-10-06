import React, { Component } from 'react';
import { PageHeader, Button, Descriptions, Modal } from 'antd';

import JSONPretty from 'react-json-pretty';

class Admin extends Component {
    state = {
        loadings: [],
        visible: [false]
      };
      
    showModal = () => {
        this.setState({visible:[true]});
      };
    
    handleOk = () => {
        this.setState({visible:[false]});
      };
    
    handleCancel = () => {
        this.setState({visible:[false]});
      };
    enterLoading = index => {
        this.setState(({ loadings }) => {
          const newLoadings = [...loadings];
          newLoadings[index] = true;
    
          return {
            loadings: newLoadings,
          };
        });
        setTimeout(() => {
          this.setState(({ loadings }) => {
            const newLoadings = [...loadings];
            newLoadings[index] = false;
    
            return {
              loadings: newLoadings,
            };
          });
        }, 6000);
      };

    render() {
        const { loadings, visible } = this.state;
        const data =[
            {
                "studyName":"abc",
                "type": "fetal",
                "organ": "placenta",
                "modality": "AXT2",
                "main_dir" : "/data/mril/users/all/mrdata/research/processed/CNMC/chd_r01/fetal/wip/kk/placenta/t2placenta/placenta_masking/chd_abc/",
                "csvfile": "",
                "trailingzeros":"00",
                "metricType": "volume",
                "root_startswith":"fetus_",
                "fileStruct":{
                    "labelconfigs":{
                        "raw_files": {
                            "folder":"",
                            "keywordsand":["axt2placenta"],
                            "keywordsor":[""],
                            "startswith":"fetus_",
                            "endswith":".nii.gz"
                        },
                        "segmentations":{
                            "folder":"",
                            "keywordsand":[""],
                            "keywordsor":[""],
                            "startswith":"fetus_",
                            "endswith":"mask.nii.gz"
                        }
                    }
                },
                "metricsStruct": [
                    {
                        "name": "volume",
                        "measures":[
                            {
                                "rois":[1],
                                "extractFrom":{
                                    "folder":"",
                                    "keywordsand":[""],
                                    "keywordsor":[""],
                                    "startswith":"fetus_",
                                    "endswith":"_mask.nii.gz"
                                }
                            }
                        ]
                    }]
            }
        ]
        return (
            <div style={{  padding: "24px", backgroundColor: "#f5f5f5" }}>
                <Modal title="Config" visible={visible[0]} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <JSONPretty id="json-pretty" data={data}></JSONPretty>
                </Modal>

                <PageHeader
                    ghost={false}
                    title="Data crawler"
                    subTitle="This may take few minutes to complete. Please refresh your home page once completed."
                    extra={[
                        <Button key="1" type="default" type="link">
                            view logs
                        </Button>,
                        <Button key="2" type="default" onClick={this.showModal} >
                            Edit configs
                        </Button>,
                        <Button key="3" type="danger" size={100} loading={loadings[0]} onClick={() => this.enterLoading(0)}>
                            Run
                        </Button>,
                        ]}
                    >
                </PageHeader>
                <br/>
                <PageHeader
                    ghost={false}
                    title="Growth trajectories"
                    subTitle="This may take few minutes to complete. Please refresh your home page once completed."
                    extra={[
                        <Button key="4" type="danger" size={100} loading={loadings[1]} onClick={() => this.enterLoading(1)}>
                            Run
                        </Button>,
                        ]}
                    >
                </PageHeader>
                <br/>
                <PageHeader
                    ghost={false}
                    title="Brain segmentation"
                    extra={[
                        <Button key="5" type="danger" size={100} loading={loadings[3]} onClick={() => this.enterLoading(3)}>
                            Run
                        </Button>,
                        ]}
                    >
                </PageHeader>
            </div>
        )
    }
}

export default Admin;