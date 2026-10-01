"""Pytest configuration and pythonpath setup."""

import sys
from pathlib import Path

# Ensure submissions/manideep667320 is on sys.path
_pkg_root = Path(__file__).resolve().parent.parent
if str(_pkg_root) not in sys.path:
    sys.path.insert(0, str(_pkg_root))
