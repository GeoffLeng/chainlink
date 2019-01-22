import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Grid } from '@material-ui/core'
import { useHooks, useState } from 'use-react-hooks'
import { hot } from 'react-hot-loader'
import { submitSignIn } from 'actions'
import HexagonLogo from 'components/HexagonLogo'
import matchRouteAndMapDispatchToProps from 'utils/matchRouteAndMapDispatchToProps'

const styles = theme => ({
  container: {
    height: '100%'
  },
  cardContent: {
    paddingTop: theme.spacing.unit * 6,
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 6
    }
  },
  headerRow: {
    textAlign: 'center'
  },
  button: {
    // margin: theme.spacing.unit * 5
  }
})

export const SignIn = useHooks((props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleChange = name => event => {
    if (name === 'email') setEmail(event.target.value)
    if (name === 'password') setPassword(event.target.value)
  }
  const onSubmit = e => {
    e.preventDefault()
    props.submitSignIn({ email, password })
  }
  const { classes, fetching, authenticated } = props

  if (authenticated) return <Redirect to='/' />
  return (
    <Grid container justify='center' alignItems='center' className={classes.container} spacing={0}>
      <Grid item xs={4}>
        <Card>
          <CardContent className={classes.cardContent}>
            <form noValidate onSubmit={onSubmit}>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} className={classes.headerRow}>
                      <HexagonLogo width={50} />
                    </Grid>
                    <Grid item xs={12} className={classes.headerRow}>
                      <Typography variant='h5'>
                        Operator
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id='email'
                    label='Email'
                    margin='normal'
                    value={email}
                    onChange={handleChange('email')}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='password'
                    label='Password'
                    type='password'
                    autoComplete='password'
                    margin='normal'
                    value={password}
                    onChange={handleChange('password')}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={0} justify='center'>
                    <Grid item>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                      >
                        Access Account
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                {fetching && (
                  <Typography variant='body1' color='textSecondary'>
                    Signing in...
                  </Typography>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
})

const mapStateToProps = state => ({
  fetching: state.authentication.fetching,
  authenticated: state.authentication.allowed
})

export const ConnectedSignIn = connect(
  mapStateToProps,
  matchRouteAndMapDispatchToProps({ submitSignIn })
)(SignIn)

export default hot(module)(withStyles(styles)(ConnectedSignIn))
