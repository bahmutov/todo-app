'use strict'

module.exports = ({ github, core }) => {
  const repo = process.env.REPO_NAME

  const payload = {
    repo,
    pullRequestNumber: process.env.PR_NUMBER,
    feedbackCommentId: process.env.FEEDBACK_COMMENT_ID,
  }

  core.info(JSON.stringify(payload))

  return new Promise((resolve, reject) => {
    // https://octokit.github.io/rest.js/v19#repos-create-dispatch-event
    github.rest.repos
      .createDispatchEvent({
        owner: 'bahmutov',
        repo: 'todo-app-tests',
        event_type: 'trigger-tests',
        client_payload: payload,
      })
      .then(() => {
        resolve({
          status: 'success',
          message: '✅ Success',
          payload,
        })
      })
      .catch((err) => {
        core.error(`Failed to dispatch event:${err}`)
        // In order to send error message in the following steps, do not raise an error
        resolve({
          status: 'fail',
          message: `❌ Error: ${err.message || 'Unknown error'}`,
          payload,
        })
      })
  })
}
