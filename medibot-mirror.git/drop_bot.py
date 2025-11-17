def callback(commit, metadata):
    # match by substrings in author/committer name or email (bytes)
    bad_substrings = [b"lovable", b"lovable-dev", b"lovable-dev[bot]"]
    # helper: check any field contains any bad substring
    def has_bad(x):
        if not x:
            return False
        for s in bad_substrings:
            if s in x:
                return True
        return False
    if has_bad(commit.author_name) or has_bad(commit.committer_name) or has_bad(commit.author_email) or has_bad(commit.committer_email):
        return None   # drop this commit
    return commit
