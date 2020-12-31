import React from 'react'
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Modal,
    Item,
    Label,
    Menu,
    Checkbox,
    Segment,
    Step,
    Table,
    GridColumn,
} from "semantic-ui-react";
import {
    isBrowser,
    isMobile
} from "react-device-detect";
import funny_gif from './assets/funny.gif'
import { CopyToClipboard } from 'react-copy-to-clipboard';


function ShareMenu(props) {
    const [open, setOpen] = React.useState(false)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='tiny'
            trigger={
                <div style={{ textAlign: "center" }}>
                <CopyToClipboard text={props.copyText}>
                  <Button
                    color='blue'
                    size='huge'
                    //onClick={this.handleShare}
                  >
                    <Icon name='share' />
                Поделиться</Button>
                </CopyToClipboard>
              </div>
            }
        >
            <Modal.Header>Готово</Modal.Header>
            <Modal.Content>
                    <p className='tableFont'>
                    Ссылка скопирована в буфер обмена!
                    </p>
                    <Image src={funny_gif} centered />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen(false)} positive centered>
                    ОК
        </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ShareMenu