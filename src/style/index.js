const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        marginLeft: 240,
        paddingTop:theme.spacing.unit * 10,
        padding: theme.spacing.unit,
        minWidth: 0, // So the Typography noWrap works
        position: 'relative'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position: 'fixed',
        width: 240,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    toolbar: theme.mixins.toolbar,
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    appBarModal: {
        position: 'relative',
    },
    paperModal: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: 20
    },
    flexModal: {
        flex: 1
    }
});

export default styles